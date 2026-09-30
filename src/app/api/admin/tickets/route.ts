import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tickets = await prisma.entranceTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("GET /api/admin/tickets Error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, type, adultPrice, childPrice, isActive } = body;

    if (!name || !type || adultPrice === undefined || childPrice === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTicket = await prisma.entranceTicket.create({
      data: {
        name,
        type,
        adultPrice: Number(adultPrice),
        childPrice: Number(childPrice),
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json(newTicket);
  } catch (error) {
    console.error("POST /api/admin/tickets Error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
