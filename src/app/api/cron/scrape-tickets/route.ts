import { NextResponse } from "next/server";
import { ScraperService } from "@/modules/tickets/ScraperService";

// This endpoint should be called by a cron job (e.g. Vercel Cron) once a day at 6 AM.
export async function GET(request: Request) {
  try {
    // Optional: add a secret token check here so only the cron can call it
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const result = await ScraperService.scrapeAndStoreTicketPrices();
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
