import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const addons = await prisma.addOnService.findMany({
      where: { active: true },
    });
    return NextResponse.json({ addons }, { status: 200 });
  } catch (error) {
    console.error("Addons error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
