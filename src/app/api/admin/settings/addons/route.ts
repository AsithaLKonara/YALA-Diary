import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { AddOnCategory } from "@/generated/prisma/client";


export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addons = await prisma.addOnService.findMany({
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ addons }, { status: 200 });
  } catch (error) {
    console.error("Admin addons fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, category, price, active, description } = data;

    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const addon = await prisma.addOnService.create({
      data: {
        name,
        category: category as AddOnCategory,
        price: parseFloat(price),
        active: active ?? true,
        description: description || null
      }
    });

    return NextResponse.json({ success: true, addon }, { status: 201 });
  } catch (error) {
    console.error("Admin create addon error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
