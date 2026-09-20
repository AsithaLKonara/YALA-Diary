import { NextResponse } from "next/server";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new SiteMinderClient();
    
    const startTime = Date.now();
    const properties = await client.getProperties();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: "Connected",
      propertiesCount: properties.length,
      roomsCount: 87, // Mocked for sandbox phase
      ratePlansCount: 132, // Mocked for sandbox phase
      availabilityStatus: "Healthy",
      lastRequest: new Date().toISOString(),
      lastResponse: `200 OK (${duration}ms)`,
      providerUrl: process.env.SITEMINDER_API_URL || "https://api.siteminder.com/sandbox/v1"
    });
  } catch (error: any) {
    console.error("SiteMinder Test Error:", error);
    return NextResponse.json({
      status: "Disconnected",
      error: error.message || "Unknown error",
      lastRequest: new Date().toISOString(),
      lastResponse: "500 Error"
    }, { status: 500 });
  }
}
