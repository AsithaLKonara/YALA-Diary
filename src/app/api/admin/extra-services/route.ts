import { NextResponse } from "next/server";
import { ExtraServiceManager } from "@/modules/packages/services/ExtraServiceManager";

export async function GET() {
  try {
    const services = await ExtraServiceManager.listAllServices();
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newService = await ExtraServiceManager.createService(data);
    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
