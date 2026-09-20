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

    const slots = await prisma.safariSlot.findMany({
      orderBy: [
        { date: "asc" },
        { slotType: "asc" }
      ],
      include: {
        bookings: {
          include: {
            booking: {
              select: {
                guestName: true
              }
            }
          }
        }
      }
    });

    // Format the response to match the expected UI structure
    const formattedSlots = slots.map(slot => {
      const bookedSeats = slot.bookings.reduce((sum, b) => sum + b.guests, 0);
      const guests = slot.bookings.map(b => b.booking.guestName);

      return {
        id: slot.id,
        date: slot.date.toISOString().split("T")[0],
        slot: slot.slotType,
        capacity: slot.capacity,
        booked: bookedSeats,
        guide: slot.guide || "Unassigned",
        guests: guests
      };
    });

    return NextResponse.json({ safaris: formattedSlots }, { status: 200 });
  } catch (error) {
    console.error("Admin safaris fetch error:", error);
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
    const { date, slotType, capacity, guide } = data;

    if (!date || !slotType || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slot = await prisma.safariSlot.create({
      data: {
        date: new Date(date),
        slotType: slotType, // AM or PM
        capacity: parseInt(capacity, 10),
        guide: guide || null
      }
    });

    return NextResponse.json({ success: true, slot }, { status: 201 });
  } catch (error) {
    console.error("Admin create safari error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
