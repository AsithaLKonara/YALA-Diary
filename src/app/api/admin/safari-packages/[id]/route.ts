import { NextResponse } from "next/server";
import { SafariPackageService } from "@/modules/packages/services/SafariPackageService";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedPackage = await SafariPackageService.updatePackage(params.id, data);
    return NextResponse.json({ package: updatedPackage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
