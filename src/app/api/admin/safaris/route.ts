import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const safariBookings = await prisma.safariBooking.findMany({
      orderBy: { date: "asc" },
      include: {
        package: true,
        booking: {
          select: { guestName: true }
        }
      }
    });

    // Group by date + packageId
    const grouped = new Map<string, any>();
    
    safariBookings.forEach(sb => {
      const dateStr = sb.date.toISOString().split("T")[0];
      const key = `${dateStr}_${sb.packageId}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          date: dateStr,
          slot: sb.package.type,
          capacity: 6, // Default capacity per jeep
          booked: 0,
          guide: "Unassigned",
          guests: []
        });
      }
      
      const group = grouped.get(key);
      group.booked += sb.guests;
      group.guests.push(sb.booking.guestName);
    });

    return NextResponse.json({ safaris: Array.from(grouped.values()) }, { status: 200 });
  } catch (error) {
    console.error("Admin safaris fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ error: "Slot creation is deprecated in the new packaging system" }, { status: 400 });
}
