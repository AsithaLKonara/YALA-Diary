import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        roomType: { select: { name: true } },
        room: { select: { number: true } }
      }
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { hotel, checkIn, checkOut, adults, children, roomTypeId, addons, guest, status, paymentStatus } = data;

    if (!checkIn || !checkOut || !roomTypeId || !guest || !guest.name || !guest.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Fetch room type to calculate revenue
    const roomType = await prisma.roomType.findUnique({ where: { id: roomTypeId }});
    if (!roomType) return NextResponse.json({ error: "Invalid room type" }, { status: 400 });

    const roomRevenue = roomType.pricePerNight * nights;

    // Validate addons and calculate revenue
    let addOnRevenue = 0;
    const addOnRecords = [];
    if (addons && Array.isArray(addons)) {
      for (const addonId of addons) {
        const addonService = await prisma.addOnService.findUnique({ where: { id: addonId }});
        if (addonService) {
          addOnRevenue += addonService.price;
          addOnRecords.push({ addOnId: addonService.id, price: addonService.price, quantity: 1 });
        }
      }
    }

    const totalRevenue = roomRevenue + addOnRevenue;
    const ref = `YD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const booking = await prisma.booking.create({
      data: {
        ref,
        hotel: hotel || "Yala Diary",
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
        roomRevenue,
        addOnRevenue,
        totalRevenue,
        status: status || "CONFIRMED",
        paymentStatus: paymentStatus || "UNPAID",
        addOns: {
          create: addOnRecords
        }
      }
    });

    // Fire real-time notification
    try {
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        title: "New Booking Created",
        message: `Booking ${booking.ref} by ${booking.guestName} has been confirmed.`,
        eventType: "notifyNewBooking"
      });
    } catch (err) {
      console.error("Failed to push notification", err);
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Admin create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
