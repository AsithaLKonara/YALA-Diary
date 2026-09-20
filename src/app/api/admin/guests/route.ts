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

    // 1. Group bookings by email to get metrics
    const grouped = await prisma.booking.groupBy({
      by: ['guestEmail'],
      _count: { id: true },
      _sum: { totalRevenue: true },
      _max: { checkIn: true }
    });

    if (grouped.length === 0) {
      return NextResponse.json({ guests: [] }, { status: 200 });
    }

    const emails = grouped.map(g => g.guestEmail);

    // 2. Fetch the latest booking for each email to get name, phone, country
    const latestBookings = await prisma.booking.findMany({
      where: { guestEmail: { in: emails } },
      orderBy: { checkIn: 'desc' },
      distinct: ['guestEmail'],
      select: {
        guestEmail: true,
        guestName: true,
        guestPhone: true,
        guestCountry: true,
        userId: true
      }
    });

    // 3. Merge data
    const guests = grouped.map(g => {
      const latest = latestBookings.find(b => b.guestEmail === g.guestEmail);
      return {
        id: g.guestEmail, // use email as ID since there's no Guest table
        email: g.guestEmail,
        name: latest?.guestName || "Unknown",
        phone: latest?.guestPhone || "",
        country: latest?.guestCountry || "",
        userId: latest?.userId,
        totalBookings: g._count.id,
        totalSpend: g._sum.totalRevenue || 0,
        lastStay: g._max.checkIn
      };
    });

    // Sort by most recent stay
    guests.sort((a, b) => {
      const dateA = a.lastStay ? new Date(a.lastStay).getTime() : 0;
      const dateB = b.lastStay ? new Date(b.lastStay).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ guests }, { status: 200 });
  } catch (error) {
    console.error("Admin guests fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
