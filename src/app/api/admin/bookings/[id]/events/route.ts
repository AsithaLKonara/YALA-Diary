import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, note, action } = await req.json();

    if (!status && !note && !action) {
      return NextResponse.json({ error: "No update provided" }, { status: 400 });
    }

    // 1. Update Booking Status if requested
    if (status) {
      await prisma.booking.update({
        where: { id: params.id },
        data: { status }
      });
    }

    // 2. Create Event
    const event = await prisma.bookingEvent.create({
      data: {
        bookingId: params.id,
        status: status || "CONFIRMED", // Default fallback if just logging a note
        action: action || "ADMIN_NOTE",
        note: note || null,
        metadata: {
          addedBy: session.user?.name || "Admin"
        }
      }
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("Admin booking event error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
