import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.safariPackage.findMany({
      where: { isActive: true },
      include: { extraServices: { where: { isActive: true } } },
      orderBy: { basePrice: "asc" }
    });

    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
