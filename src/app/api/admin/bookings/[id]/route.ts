import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, paymentStatus, roomId } = await req.json();

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(roomId && { roomId }),
      }
    });

    return NextResponse.json({ success: true, booking }, { status: 200 });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        safariBookings: {
          include: {
            package: true,
            entranceTicket: true
          }
        },
        serviceBookings: {
          include: {
            service: true
          }
        },
        events: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching booking details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
