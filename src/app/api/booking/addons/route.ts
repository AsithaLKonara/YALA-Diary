import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");

    let whereClause: any = { isActive: true };

    if (packageId) {
      whereClause.safariPackages = {
        some: { id: packageId, isActive: true }
      };
    }

    const addons = await prisma.extraService.findMany({
      where: whereClause,
      orderBy: { category: "asc" }
    });
    return NextResponse.json({ addons }, { status: 200 });
  } catch (error) {
    console.error("Addons error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
