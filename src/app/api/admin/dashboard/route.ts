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

    // KPI 1: Active Bookings (Confirmed, Checked_in)
    const activeBookings = await prisma.booking.count({
      where: {
        status: { in: ["CONFIRMED", "CHECKED_IN"] }
      }
    });

    // KPI 2: Today's Check-ins
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCheckins = await prisma.booking.count({
      where: {
        checkIn: {
          gte: new Date(`${todayStr}T00:00:00.000Z`),
          lte: new Date(`${todayStr}T23:59:59.999Z`)
        }
      }
    });

    // KPI 3: Month Revenue
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const bookingsThisMonth = await prisma.booking.findMany({
      where: {
        createdAt: { gte: firstDay },
        status: { not: "CANCELLED" }
      },
      select: { totalRevenue: true }
    });
    const monthRevenue = bookingsThisMonth.reduce((acc, b) => acc + b.totalRevenue, 0);

    // KPI 4: Occupancy
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({
      where: { status: "OCCUPIED" }
    });
    const occupancyPct = totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);

    // Upcoming Bookings (Pending, Confirmed) Next 5
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: { in: ["DRAFT", "PENDING_PAYMENT", "PAYMENT_SUCCESS", "CREATING_RESERVATION", "CONFIRMED"] },
        checkIn: { gte: new Date(`${todayStr}T00:00:00.000Z`) }
      },
      orderBy: { checkIn: "asc" },
      take: 5,
      include: {
        roomType: { select: { name: true } },
        room: { select: { number: true } }
      }
    });

    return NextResponse.json({
      stats: {
        activeBookings,
        todayCheckins,
        monthRevenue,
        occupancyPct,
        occupiedRooms,
        totalRooms
      },
      upcomingBookings
    }, { status: 200 });
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
