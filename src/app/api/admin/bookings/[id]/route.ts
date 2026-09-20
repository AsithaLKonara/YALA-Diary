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
