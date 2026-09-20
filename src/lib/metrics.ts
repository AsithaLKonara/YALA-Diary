import { prisma } from "@/lib/prisma";

export class MetricService {
  /**
   * Retrieves core KPIs (Revenue, Bookings, Cancellation Rate, Occupancy)
   * Calculates metrics for the last 6 months.
   */
  static async getCoreMetrics() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      select: {
        status: true,
        totalRevenue: true,
        checkIn: true,
        checkOut: true,
        nights: true,
        userId: true,
        guestCountry: true
      }
    });

    // 1. Total Revenue & Cancellation Rate
    let totalRevenue = 0;
    let cancelledCount = 0;

    bookings.forEach(b => {
      if (b.status === "CANCELLED") {
        cancelledCount++;
      } else {
        totalRevenue += b.totalRevenue;
      }
    });

    const totalBookings = bookings.length;
    const cancellationRate = totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0;

    // 2. Monthly Trend (Revenue & Occupancy)
    const monthlyData: Record<string, { revenue: number; bookedNights: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize the last 6 months to ensure zeroes are not just missing
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      monthlyData[mName] = { revenue: 0, bookedNights: 0 };
    }

    bookings.forEach(b => {
      if (b.status !== "CANCELLED") {
        const mName = monthNames[b.checkIn.getMonth()];
        if (monthlyData[mName]) {
          monthlyData[mName].revenue += b.totalRevenue;
          monthlyData[mName].bookedNights += b.nights;
        }
      }
    });

    // Calculate Occupancy
    const totalRooms = await prisma.room.count();
    const daysInMonth = 30; // Approximation for BI trend
    const totalAvailableNightsPerMonth = totalRooms * daysInMonth;

    const monthlyRevenueTrend = [];
    const monthlyOccupancyTrend = [];
    let sumOccupancy = 0;
    let occupancyMonthsCount = 0;

    for (const [month, data] of Object.entries(monthlyData)) {
      monthlyRevenueTrend.push({ month, revenue: data.revenue });
      
      const occupancyRate = totalAvailableNightsPerMonth > 0 
        ? Math.round((data.bookedNights / totalAvailableNightsPerMonth) * 100) 
        : 0;
        
      monthlyOccupancyTrend.push({ month, rate: Math.min(100, occupancyRate) });
      
      sumOccupancy += occupancyRate;
      occupancyMonthsCount++;
    }

    const avgOccupancy = occupancyMonthsCount > 0 ? Math.round(sumOccupancy / occupancyMonthsCount) : 0;

    // 3. Booking Sources (Derived from userId)
    let directCount = 0;
    let registeredCount = 0;
    
    bookings.forEach(b => {
      if (b.status !== "CANCELLED") {
        if (b.userId) registeredCount++;
        else directCount++;
      }
    });
    
    const activeBookingsCount = totalBookings - cancelledCount;
    const bookingSources = activeBookingsCount > 0 ? [
      { name: "Walk-in / Direct", value: Math.round((directCount / activeBookingsCount) * 100) },
      { name: "Online Account", value: Math.round((registeredCount / activeBookingsCount) * 100) }
    ] : [];

    // 4. Nationalities
    const countryCounts: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.status !== "CANCELLED" && b.guestCountry) {
        const c = b.guestCountry;
        countryCounts[c] = (countryCounts[c] || 0) + 1;
      }
    });

    const topNationalities = Object.entries(countryCounts)
      .map(([country, guests]) => ({ country, guests }))
      .sort((a, b) => b.guests - a.guests)
      .slice(0, 7); // Top 7

    return {
      kpis: {
        totalRevenue,
        totalBookings,
        cancellationRate,
        avgOccupancy
      },
      trends: {
        revenue: monthlyRevenueTrend,
        occupancy: monthlyOccupancyTrend
      },
      sources: bookingSources,
      nationalities: topNationalities
    };
  }
}
