import { NextResponse } from "next/server";
import { MetricService } from "@/lib/metrics";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await MetricService.getCoreMetrics();

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Admin reports fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
