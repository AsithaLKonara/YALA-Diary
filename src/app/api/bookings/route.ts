import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/seo/config";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { calculateSafariPrice, calculateServicePrice } from "@/lib/pricing";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    let { 
      isSafariOnly, safariPackageId, 
      hotelId, checkIn, checkOut, adults, children, roomTypeId, ratePlanId, 
      addons, guest, userId, price, pricingSnapshot,
      entranceTicketType, entranceTicketBlock, entranceTicketDuration, entranceTicketPrice
    } = data;

    adults = parseInt(adults as any) || 1;
    children = parseInt(children as any) || 0;

    if (!checkIn || !checkOut || !guest || !guest.name || !guest.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Validate addons and calculate revenue
    let addOnRevenue = 0;
    const addOnRecords = [];
    if (addons && Array.isArray(addons)) {
      for (const addon of addons) {
        const addonId = typeof addon === 'string' ? addon : addon.id;
        const addonService = await prisma.extraService.findUnique({ where: { id: addonId }});
        if (addonService) {
          let cost = 0;
          if (addonService.pricingOptions) {
            const res = calculateServicePrice(addonService.pricingOptions as any, adults, children, addon.selectedOptions);
            cost = res.valid ? res.totalPrice : 0;
          } else {
            cost = addonService.pricingModel === "PER_PERSON" ? addonService.basePrice * (adults + children) : addonService.basePrice;
          }
          addOnRevenue += cost;
          addOnRecords.push({ serviceId: addonService.id, quantity: 1, totalPrice: cost });
        }
      }
    }

    const ref = `YD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const bookingAttemptId = randomUUID(); // Idempotency key

    let booking;
    let productName = "Yala Diary Booking";

    if (isSafariOnly) {
      if (!safariPackageId) return NextResponse.json({ error: "Missing Safari Package ID" }, { status: 400 });
      
      const pkg = await prisma.safariPackage.findUnique({ where: { id: safariPackageId } });
      if (!pkg) return NextResponse.json({ error: "Invalid Safari Package" }, { status: 400 });

      let calculatedSafariPrice = 0;
      if (pkg.pricingRules) {
        const res = calculateSafariPrice(pkg.pricingRules as any, adults, children);
        calculatedSafariPrice = res.valid ? res.totalPrice : 0;
      } else {
        calculatedSafariPrice = pkg.pricingType === "PER_PERSON" ? pkg.basePrice * (adults + children) : pkg.basePrice;
      }
      const ticketRevenue = (entranceTicketType === 'COMPANY_PROVIDED' && entranceTicketPrice) ? entranceTicketPrice : 0;
      const governmentTax = (ticketRevenue * 0.18) + 10;
      const totalRev = calculatedSafariPrice + addOnRevenue + ticketRevenue + governmentTax;
      const finalAddOnRevenue = addOnRevenue + ticketRevenue + governmentTax;
      productName = `Safari Package - ${pkg.name}`;

      booking = await prisma.booking.create({
        data: {
          ref,
          bookingAttemptId,
          userId: userId || null,
          guestName: guest.name,
          guestEmail: guest.email,
          guestPhone: guest.phone || "",
          guestCountry: guest.country || "Unknown",
          specialRequests: guest.requests || "",
          checkIn: checkInDate,
          checkOut: checkOutDate,
          nights,
          adults,
          children,
          roomRevenue: calculatedSafariPrice, // Treat safari price as base room revenue
          addOnRevenue: finalAddOnRevenue,
          totalRevenue: totalRev,
          status: "PENDING_PAYMENT",
          paymentStatus: "UNPAID",
          serviceBookings: {
            create: addOnRecords
          },
          safariBookings: {
            create: {
              packageId: safariPackageId,
              date: checkInDate,
              guests: adults + children,
              adultsCount: adults,
              childrenCount: children,
              entranceTicketType: entranceTicketType || null,
              entranceTicketId: data.entranceTicketId || null,
              entranceTicketPrice: data.entranceTicketPrice || null,
              pricingSnapshot: data.pricingSnapshot || null,
            }
          }
        }
      });

      await prisma.bookingEvent.create({
        data: { bookingId: booking.id, status: "PENDING_PAYMENT", action: "SAFARI_BOOKING_CREATED", metadata: { attemptId: bookingAttemptId } }
      });
    } else {
      // Hotel Logic
      if (!hotelId || !roomTypeId) {
        return NextResponse.json({ error: "Missing hotel or room type ID" }, { status: 400 });
      }

      const hotel = await prisma.hotel.findUnique({ where: { id: hotelId }});
      if (!hotel || !hotel.externalId) {
        return NextResponse.json({ error: "Invalid hotel or missing provider mapping" }, { status: 400 });
      }

      const roomType = await prisma.roomType.findUnique({ where: { id: roomTypeId }});
      const ratePlan = ratePlanId ? await prisma.ratePlan.findUnique({ where: { id: ratePlanId }}) : null;
      if (!roomType || !roomType.externalId) return NextResponse.json({ error: "Invalid room type" }, { status: 400 });

      const roomRevenue = price || (roomType.pricePerNight * nights); 
      const totalRevenue = roomRevenue + addOnRevenue;
      productName = `Hotel Booking - ${hotel.name} (${roomType.name})`;

      booking = await prisma.booking.create({
        data: {
          ref,
          bookingAttemptId,
          hotelId: hotel.id,
          userId: userId || null,
          guestName: guest.name,
          guestEmail: guest.email,
          guestPhone: guest.phone || "",
          guestCountry: guest.country || "Unknown",
          specialRequests: guest.requests || "",
          checkIn: checkInDate,
          checkOut: checkOutDate,
          nights,
          adults,
          children,
          roomTypeId,
          ratePlanId,
          roomRevenue,
          addOnRevenue,
          totalRevenue,
          status: "PENDING_PAYMENT",
          paymentStatus: "UNPAID",
          serviceBookings: {
            create: addOnRecords
          }
        }
      });

      await prisma.bookingEvent.create({
        data: { bookingId: booking.id, status: "PENDING_PAYMENT", action: "BOOKING_CREATED", metadata: { attemptId: bookingAttemptId } }
      });
    }

    // Create Stripe Checkout Session
    const origin = req.headers.get("origin") || getBaseUrl();
    
    // For zero total revenue, just confirm immediately
    if (booking.totalRevenue <= 0) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED", paymentStatus: "PAID" }
      });
      // Webhook won't fire, so we could send email here if we want, but for now we'll assume there is always a price.
      return NextResponse.json({ success: true, booking }, { status: 201 });
    }

    if (process.env.USE_MOCK_PAYMENTS === 'true') {
      console.warn("Using mock Stripe checkout session because USE_MOCK_PAYMENTS is true.");
      // Automatically confirm the booking for local testing
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED", paymentStatus: "PAID" }
      });
      
      return NextResponse.json({ 
        success: true, 
        checkoutUrl: `${origin}/book/success?session_id=mock_session_${booking.id}` 
      }, { status: 201 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(booking.totalRevenue * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book`,
      client_reference_id: booking.id,
      metadata: {
        bookingId: booking.id,
        isSafariOnly: isSafariOnly ? 'true' : 'false'
      }
    });

    return NextResponse.json({ success: true, checkoutUrl: session.url }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
