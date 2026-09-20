import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ email: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = decodeURIComponent(params.email);

    const bookings = await prisma.booking.findMany({
      where: { guestEmail: email },
      orderBy: { createdAt: "desc" },
      include: {
        roomType: { select: { name: true } },
        room: { select: { number: true } }
      }
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Admin guest bookings fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
