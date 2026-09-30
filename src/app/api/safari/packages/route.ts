import { NextResponse } from "next/server";
import { SafariPackageService } from "@/modules/packages/services/SafariPackageService";

export async function GET() {
  try {
    const packages = await SafariPackageService.listActivePackages();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
