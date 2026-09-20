import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        roomTypes: {
          include: { ratePlans: true }
        }
      }
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Hotel Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    const { category, distanceFromYala, featured, active, description } = data;

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        category,
        distanceFromYala: distanceFromYala ? parseFloat(distanceFromYala) : null,
        description,
        active
      }
    });

    return NextResponse.json({ success: true, hotel }, { status: 200 });
  } catch (error: any) {
    console.error("Update Hotel Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
