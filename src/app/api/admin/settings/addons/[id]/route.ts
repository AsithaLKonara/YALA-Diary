import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { AddOnCategory } from "@/generated/prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing addon ID" }, { status: 400 });

    const data = await req.json();
    const updateData: any = {};


    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category as AddOnCategory;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.active !== undefined) updateData.active = data.active;
    if (data.description !== undefined) updateData.description = data.description;

    const addon = await prisma.addOnService.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, addon }, { status: 200 });
  } catch (error) {
    console.error("Admin update addon error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing addon ID" }, { status: 400 });

    await prisma.addOnService.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin delete addon error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
