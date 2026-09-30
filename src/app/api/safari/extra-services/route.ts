import { NextResponse } from "next/server";
import { ExtraServiceManager } from "@/modules/packages/services/ExtraServiceManager";

export async function GET() {
  try {
    const services = await ExtraServiceManager.listActiveServices();
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
