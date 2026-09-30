import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PUT(request: Request, context: any) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // Resolve params for Next.js 15
    const params = await context.params;

    const body = await request.json();
    const { name, type, adultPrice, childPrice, isActive } = body;

    const updatedTicket = await prisma.entranceTicket.update({
      where: { id: params.id },
      data: {
        name,
        type,
        adultPrice: adultPrice !== undefined ? Number(adultPrice) : undefined,
        childPrice: childPrice !== undefined ? Number(childPrice) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("PUT /api/admin/tickets/[id] Error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // Resolve params for Next.js 15
    const params = await context.params;

    await prisma.entranceTicket.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/tickets/[id] Error:", error);
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
