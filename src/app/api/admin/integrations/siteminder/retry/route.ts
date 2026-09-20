import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find bookings that were paid but failed to create on SiteMinder or are stuck in CREATING
    const stuckBookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PAYMENT_SUCCESS", "CREATING_RESERVATION", "FAILED"]
        },
        paymentStatus: "PAID",
        externalReservationId: null, // Ensure they aren't actually synced
      },
      include: {
        hotelRef: true,
        roomType: true,
      }
    });

    if (stuckBookings.length === 0) {
      return NextResponse.json({ success: true, message: "No stuck bookings found", processed: 0 });
    }

    const client = new SiteMinderClient();
    let processed = 0;
    const errors = [];

    for (const booking of stuckBookings) {
      if (!booking.hotelRef?.externalId || !booking.roomType.externalId) {
        errors.push(`Booking ${booking.id}: Missing mapping for hotel or room type`);
        continue;
      }

      try {
        await prisma.bookingEvent.create({
          data: { bookingId: booking.id, status: booking.status, action: "SITEMINDER_RETRY_START" }
        });

        const reservation = await client.createReservation({
          hotelId: booking.hotelRef.externalId,
          roomTypeId: booking.roomType.externalId,
          ratePlanId: booking.ratePlanId || "UNKNOWN",
          checkIn: booking.checkIn.toISOString().split('T')[0],
          checkOut: booking.checkOut.toISOString().split('T')[0],
          guest: {
            firstName: booking.guestName.split(' ')[0] || "Unknown",
            lastName: booking.guestName.split(' ').slice(1).join(' ') || "Unknown",
            email: booking.guestEmail,
            phone: booking.guestPhone,
            country: booking.guestCountry
          },
          price: { amount: booking.roomRevenue, currency: booking.currency }
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            status: "CONFIRMED", 
            externalReservationId: reservation.id 
          }
        });

        await prisma.bookingEvent.create({
          data: { bookingId: booking.id, status: "CONFIRMED", action: "SITEMINDER_RETRY_SUCCESS", metadata: { externalId: reservation.id } }
        });

        processed++;
      } catch (e: any) {
        errors.push(`Booking ${booking.id}: ${e.message}`);
        await prisma.bookingEvent.create({
          data: { bookingId: booking.id, status: booking.status, action: "SITEMINDER_RETRY_FAILED", metadata: { error: e.message } }
        });
      }
    }

    return NextResponse.json({ success: true, processed, errors }, { status: 200 });
  } catch (error) {
    console.error("Retry bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
