import { NextResponse } from "next/server";
import { ExtraServiceManager } from "@/modules/packages/services/ExtraServiceManager";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedService = await ExtraServiceManager.updateService(params.id, data);
    return NextResponse.json({ service: updatedService });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
