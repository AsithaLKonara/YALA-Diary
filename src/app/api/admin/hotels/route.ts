import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        roomTypes: { select: { id: true, name: true, active: true } },
      }
    });

    return NextResponse.json({ success: true, hotels }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Hotels Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
