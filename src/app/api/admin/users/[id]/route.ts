import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, role: newRole } = await req.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(newRole && { role: newRole }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session?.user as any)?.id;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.id === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
