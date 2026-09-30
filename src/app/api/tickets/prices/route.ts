import { NextResponse } from "next/server";
import { ScraperService } from "@/modules/tickets/ScraperService";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    let prices = await ScraperService.getTicketPrices();
    
    // If empty, try to scrape or insert fallbacks immediately
    if (prices.length === 0) {
      const result = await ScraperService.scrapeAndStoreTicketPrices();
      if (!result.success && result.prices?.length === 0) {
        prices = await ScraperService.getTicketPrices();
      } else {
        prices = result.prices as any;
      }
    }
    
    return NextResponse.json({ prices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
