import { NextResponse } from "next/server";
import { SafariPackageService } from "@/modules/packages/services/SafariPackageService";

export async function GET() {
  try {
    const packages = await SafariPackageService.listAllPackages();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newPackage = await SafariPackageService.createPackage(data);
    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
