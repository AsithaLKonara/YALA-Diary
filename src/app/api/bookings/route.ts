import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { randomUUID } from "crypto";

import { calculateSafariPrice, calculateServicePrice } from "@/lib/pricing";
import { RATES } from "@/lib/currency";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      isSafariOnly, safariPackageId, 
      hotelId, checkIn, checkOut, adults, children, roomTypeId, ratePlanId, 
      addons, guest, userId, price, pricingSnapshot,
      entranceTicketType, entranceTicketBlock, entranceTicketDuration, entranceTicketPrice
    } = data;

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
      const totalRev = calculatedSafariPrice + addOnRevenue;

      let booking = await prisma.booking.create({
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
          addOnRevenue,
          totalRevenue: totalRev,
          status: "CONFIRMED",
          paymentStatus: "PAID",
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
              pricingSnapshot: data.pricingSnapshot || null,
            }
          }
        }
      });

      await prisma.bookingEvent.create({
        data: { bookingId: booking.id, status: "CONFIRMED", action: "SAFARI_BOOKING_CREATED", metadata: { attemptId: bookingAttemptId } }
      });

      return NextResponse.json({ success: true, booking }, { status: 201 });
    }

    // --- Original Hotel Logic ---
    if (!hotelId || !roomTypeId) {
      return NextResponse.json({ error: "Missing hotel or room type ID" }, { status: 400 });
    }

    // Validate hotel and rate plan
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId }});
    if (!hotel || !hotel.externalId) {
      return NextResponse.json({ error: "Invalid hotel or missing provider mapping" }, { status: 400 });
    }

    const roomType = await prisma.roomType.findUnique({ where: { id: roomTypeId }});
    const ratePlan = ratePlanId ? await prisma.ratePlan.findUnique({ where: { id: ratePlanId }}) : null;
    if (!roomType || !roomType.externalId) return NextResponse.json({ error: "Invalid room type" }, { status: 400 });

    const roomRevenue = price || (roomType.pricePerNight * nights); 
    const totalRevenue = roomRevenue + addOnRevenue;

    // 1. Create booking in DRAFT state
    let booking = await prisma.booking.create({
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
        status: "DRAFT",
        paymentStatus: "UNPAID",
        serviceBookings: {
          create: addOnRecords
        }
      }
    });

    await prisma.bookingEvent.create({
      data: { bookingId: booking.id, status: "DRAFT", action: "BOOKING_CREATED", metadata: { attemptId: bookingAttemptId } }
    });

    // 2. Simulate Payment Success (in real app, this happens in a webhook)
    booking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "PAYMENT_SUCCESS", paymentStatus: "PAID" }
    });
    
    await prisma.bookingEvent.create({
      data: { bookingId: booking.id, status: "PAYMENT_SUCCESS", action: "PAYMENT_PROCESSED" }
    });

    // 3. Create Reservation on Provider
    booking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CREATING_RESERVATION" }
    });
    
    await prisma.bookingEvent.create({
      data: { bookingId: booking.id, status: "CREATING_RESERVATION", action: "SITEMINDER_SYNC_START" }
    });

    try {
      const client = new SiteMinderClient();
      const reservation = await client.createReservation({
        hotelId: hotel.externalId,
        roomTypeId: roomType.externalId,
        ratePlanId: ratePlan?.externalId || "UNKNOWN",
        checkIn,
        checkOut,
        guest,
        price: { amount: roomRevenue, currency: "USD" }
      });

      // 4. Success -> CONFIRMED
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: { 
          status: "CONFIRMED", 
          externalReservationId: reservation.id 
        }
      });
      
      await prisma.bookingEvent.create({
        data: { 
          bookingId: booking.id, 
          status: "CONFIRMED", 
          action: "SITEMINDER_SYNC_SUCCESS", 
          metadata: { externalId: reservation.id } 
        }
      });

    } catch (providerError: any) {
      // 5. Failure -> FAILED
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "FAILED" }
      });

      await prisma.bookingEvent.create({
        data: { 
          bookingId: booking.id, 
          status: "FAILED", 
          action: "SITEMINDER_SYNC_FAILED", 
          metadata: { error: providerError.message || "Unknown error" } 
        }
      });

      return NextResponse.json({ error: "Booking saved but failed to sync to provider. Support will contact you." }, { status: 502 });
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
