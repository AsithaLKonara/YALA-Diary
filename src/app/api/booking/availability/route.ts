import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { globalCache } from "@/lib/cache";
import { AvailabilityResult } from "@/modules/connectivity/core/interfaces/HotelChannelProvider";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = parseInt(searchParams.get("adults") || "1", 10);
    const children = parseInt(searchParams.get("children") || "0", 10);
    const hotelIdParam = searchParams.get("hotelId");

    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing checkIn or checkOut dates" }, { status: 400 });
    }

    // 1. Fetch active properties from DB
    const whereClause: any = { active: true };
    if (hotelIdParam) whereClause.id = hotelIdParam;

    const hotels = await prisma.hotel.findMany({
      where: whereClause,
      include: {
        roomTypes: {
          where: { active: true },
          include: { ratePlans: { where: { active: true } } }
        }
      }
    });

    if (hotels.length === 0) {
      return NextResponse.json({ available: [] }, { status: 200 });
    }

    const client = new SiteMinderClient();
    const available = [];

    // Cache key for search query
    const cacheKey = `avail_${checkIn}_${checkOut}_${adults}_${children}`;
    let allProviderResults: AvailabilityResult[] = globalCache.get(cacheKey) || [];

    const fetchFromProvider = allProviderResults.length === 0;

    for (const hotel of hotels) {
      if (!hotel.externalId) continue;

      let providerResults: AvailabilityResult[] = [];
      
      if (fetchFromProvider) {
        // Query SiteMinder for this hotel
        providerResults = await client.getAvailability({
          hotelId: hotel.externalId,
          checkIn,
          checkOut,
          adults,
          children
        });
        allProviderResults = [...allProviderResults, ...providerResults];
      } else {
        providerResults = allProviderResults.filter(r => r.hotelId === hotel.externalId);
      }

      // Filter and map provider results to our DB models
      for (const res of providerResults) {
        if (!res.available || res.roomsAvailable <= 0) continue;

        const dbRoomType = hotel.roomTypes.find(rt => rt.externalId === res.roomTypeId);
        if (!dbRoomType) continue; // Inactive or unmapped

        const dbRatePlan = dbRoomType.ratePlans.find(rp => rp.externalId === res.ratePlanId);
        if (!dbRatePlan) continue; // Inactive or unmapped

        available.push({
          hotelId: hotel.id,
          hotelName: hotel.name,
          category: hotel.category,
          roomTypeId: dbRoomType.id,
          roomTypeName: dbRoomType.name,
          description: dbRoomType.description,
          maxCapacity: dbRoomType.maxCapacity,
          ratePlanId: dbRatePlan.id,
          ratePlanName: dbRatePlan.name,
          mealPlan: dbRatePlan.mealPlan,
          pricePerNight: res.price.amount, // Real-time price from provider
          currency: res.price.currency,
          availableRooms: res.roomsAvailable,
          cancellationPolicy: res.cancellation.type
        });
      }
    }

    if (fetchFromProvider) {
      globalCache.set(cacheKey, allProviderResults, 120); // Cache for 2 minutes
    }

    // Sort by price
    available.sort((a, b) => a.pricePerNight - b.pricePerNight);

    return NextResponse.json({ available }, { status: 200 });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
