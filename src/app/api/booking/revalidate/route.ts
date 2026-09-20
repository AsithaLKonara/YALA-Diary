import { NextResponse } from "next/server";
import { RevalidationService } from "@/modules/connectivity/services/RevalidateAvailability";
import { ProviderError } from "@/modules/connectivity/core/errors";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      hotelExternalId, roomTypeExternalId, ratePlanExternalId, 
      checkIn, checkOut, adults, children, expectedPrice 
    } = data;

    if (!hotelExternalId || !roomTypeExternalId || !ratePlanExternalId || !expectedPrice) {
      return NextResponse.json({ error: "Missing required fields for revalidation" }, { status: 400 });
    }

    await RevalidationService.execute({
      hotelExternalId,
      roomTypeExternalId,
      ratePlanExternalId,
      checkIn,
      checkOut,
      adults: parseInt(adults, 10) || 1,
      children: parseInt(children, 10) || 0,
      expectedPrice: parseFloat(expectedPrice)
    });

    return NextResponse.json({ success: true, revalidated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Revalidation Error:", error);
    if (error instanceof ProviderError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to revalidate room availability" }, { status: 500 });
  }
}
