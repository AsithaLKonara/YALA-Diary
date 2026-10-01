import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const rawBody = await req.arrayBuffer();
  const body = Buffer.from(rawBody);
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_mock"
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.client_reference_id || session.metadata?.bookingId;
    const isSafariOnly = session.metadata?.isSafariOnly === 'true';

    if (!bookingId) {
      console.error("No booking ID found in session");
      return NextResponse.json({ error: "Invalid Session" }, { status: 400 });
    }

    let booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        safariBookings: { include: { package: true } },
        serviceBookings: { include: { service: true } },
      }
    });

    if (!booking) {
      console.error("Booking not found:", bookingId);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (isSafariOnly) {
      // Update Safari Booking to Confirmed & Paid
      booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED", paymentStatus: "PAID", amountPaid: booking.totalRevenue },
        include: {
          safariBookings: { include: { package: true } },
          serviceBookings: { include: { service: true } },
        }
      });
      await prisma.bookingEvent.create({
        data: { bookingId, status: "CONFIRMED", action: "PAYMENT_PROCESSED" }
      });
    } else {
      // Update Hotel Booking to Payment Success
      booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PAYMENT_SUCCESS", paymentStatus: "PAID", amountPaid: booking.totalRevenue },
        include: {
          safariBookings: { include: { package: true } },
          serviceBookings: { include: { service: true } },
        }
      });
      
      await prisma.bookingEvent.create({
        data: { bookingId, status: "PAYMENT_SUCCESS", action: "PAYMENT_PROCESSED" }
      });

      // Hotel logic for Siteminder
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CREATING_RESERVATION" }
      });
      await prisma.bookingEvent.create({
        data: { bookingId, status: "CREATING_RESERVATION", action: "SITEMINDER_SYNC_START" }
      });

      try {
        const client = new SiteMinderClient();
        const hotel = await prisma.hotel.findUnique({ where: { id: booking.hotelId! }});
        const roomType = await prisma.roomType.findUnique({ where: { id: booking.roomTypeId! }});
        const ratePlan = booking.ratePlanId ? await prisma.ratePlan.findUnique({ where: { id: booking.ratePlanId }}) : null;
        
        if (hotel && roomType) {
          const reservation = await client.createReservation({
            hotelId: hotel.externalId!,
            roomTypeId: roomType.externalId!,
            ratePlanId: ratePlan?.externalId || "UNKNOWN",
            checkIn: booking.checkIn.toISOString(),
            checkOut: booking.checkOut.toISOString(),
            guest: {
              firstName: booking.guestName.split(' ')[0],
              lastName: booking.guestName.split(' ').slice(1).join(' ') || 'Guest',
              email: booking.guestEmail,
              phone: booking.guestPhone,
              country: booking.guestCountry,
            },
            price: { amount: booking.roomRevenue, currency: "USD" }
          });

          booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED", externalReservationId: reservation.id },
            include: {
              safariBookings: { include: { package: true } },
              serviceBookings: { include: { service: true } },
            }
          });
          
          await prisma.bookingEvent.create({
            data: { bookingId, status: "CONFIRMED", action: "SITEMINDER_SYNC_SUCCESS", metadata: { externalId: reservation.id } }
          });
        }
      } catch (providerError: any) {
        booking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "FAILED" },
          include: {
            safariBookings: { include: { package: true } },
            serviceBookings: { include: { service: true } },
          }
        });
        await prisma.bookingEvent.create({
          data: { bookingId, status: "FAILED", action: "SITEMINDER_SYNC_FAILED", metadata: { error: providerError.message || "Unknown error" } }
        });
        console.error("Provider Error:", providerError.message);
      }
    }

    // Send the Confirmation Email
    if (booking.status === "CONFIRMED") {
      await sendBookingConfirmationEmail(booking);
    }
  } else if (event.type === "checkout.session.async_payment_failed" || event.type === "payment_intent.payment_failed") {
    // Payment failed
    const sessionOrIntent = event.data.object as any;
    let bookingId;
    
    if (event.type === "checkout.session.async_payment_failed") {
      bookingId = sessionOrIntent.client_reference_id || sessionOrIntent.metadata?.bookingId;
    } else {
      // payment_intent.payment_failed - try to find checkout session
      const sessions = await stripe.checkout.sessions.list({ payment_intent: sessionOrIntent.id, limit: 1 });
      if (sessions.data.length > 0) {
        bookingId = sessions.data[0].client_reference_id || sessions.data[0].metadata?.bookingId;
      }
    }

    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED", paymentStatus: "UNPAID" }
      });
      await prisma.bookingEvent.create({
        data: { bookingId, status: "CANCELLED", action: "PAYMENT_FAILED" }
      });
    }
  }

  return NextResponse.json({ received: true });
}
