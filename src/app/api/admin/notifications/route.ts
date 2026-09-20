import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const unreadCount = await prisma.notification.count({ where: { read: false } });

    return NextResponse.json({ notifications, unreadCount }, { status: 200 });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Support "mark all as read" or specific ID
    if (data.action === "markAllRead") {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true }
      });
    } else if (data.id) {
      await prisma.notification.update({
        where: { id: data.id },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
