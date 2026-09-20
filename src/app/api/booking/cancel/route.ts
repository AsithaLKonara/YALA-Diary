import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const data = await req.json();
    const { bookingId, reason } = data;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId }});
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Security: Only admin or the booking owner can cancel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session?.user as any)?.id;
    if (userRole !== "ADMIN" && booking.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 });
    }

    // 1. If it has an external reservation, cancel on provider first
    if (booking.externalReservationId) {
      try {
        const client = new SiteMinderClient();
        await client.cancelReservation({
          reservationId: booking.externalReservationId,
          reason: reason || "Guest requested cancellation"
        });

        await prisma.bookingEvent.create({
          data: { 
            bookingId: booking.id, 
            status: booking.status, 
            action: "SITEMINDER_CANCEL_SUCCESS", 
            metadata: { externalId: booking.externalReservationId } 
          }
        });
      } catch (providerError: any) {
        console.error("Provider Cancellation Error:", providerError);
        await prisma.bookingEvent.create({
          data: { 
            bookingId: booking.id, 
            status: booking.status, 
            action: "SITEMINDER_CANCEL_FAILED", 
            metadata: { error: providerError.message } 
          }
        });
        return NextResponse.json({ error: "Failed to cancel with provider. Please contact support." }, { status: 502 });
      }
    }

    // 2. Update local DB
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" }
    });

    await prisma.bookingEvent.create({
      data: { bookingId: booking.id, status: "CANCELLED", action: "BOOKING_CANCELLED", metadata: { reason } }
    });

    return NextResponse.json({ success: true, booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
