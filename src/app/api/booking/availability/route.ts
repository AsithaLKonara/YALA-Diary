import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = parseInt(searchParams.get("adults") || "1", 10);
    const children = parseInt(searchParams.get("children") || "0", 10);
    
    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing checkIn or checkOut dates" }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const totalGuests = adults + children;

    // Fetch all room types and their total rooms
    const roomTypes = await prisma.roomType.findMany({
      include: {
        rooms: { select: { id: true } }
      }
    });

    // Find overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        status: { not: "CANCELLED" },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate }
      },
      select: { roomTypeId: true }
    });

    // Group bookings by room type
    const bookedCounts: Record<string, number> = {};
    for (const b of overlappingBookings) {
      bookedCounts[b.roomTypeId] = (bookedCounts[b.roomTypeId] || 0) + 1;
    }

    // Filter available room types
    const available = roomTypes.map(rt => {
      const totalRooms = rt.rooms.length;
      const bookedRooms = bookedCounts[rt.id] || 0;
      const availableRooms = totalRooms - bookedRooms;
      
      return {
        id: rt.id,
        name: rt.name,
        description: rt.description,
        pricePerNight: rt.pricePerNight,
        maxCapacity: rt.maxCapacity,
        availableRooms
      };
    }).filter(rt => rt.availableRooms > 0 && rt.maxCapacity >= totalGuests);

    return NextResponse.json({ available }, { status: 200 });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
