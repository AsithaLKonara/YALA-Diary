import { NextResponse } from "next/server";
import { SafariPackageService } from "@/modules/packages/services/SafariPackageService";
import { ExtraServiceManager } from "@/modules/packages/services/ExtraServiceManager";

export async function POST(request: Request) {
  try {
    const { packageId, guests = 1, extraServices = [], distanceKm = 0 } = await request.json();

    // Calculate Package Price
    const packages = await SafariPackageService.listActivePackages();
    const selectedPackage = packages.find(p => p.id === packageId);
    
    if (!selectedPackage) {
      return NextResponse.json({ error: "Invalid Package ID" }, { status: 400 });
    }

    let total = 0;
    if (selectedPackage.pricingType === "PER_PERSON") {
      total += selectedPackage.basePrice * guests;
    } else {
      total += selectedPackage.basePrice; // PER_JEEP
    }

    // Calculate Extras Price
    let extrasTotal = 0;
    const itemizedExtras = [];

    for (const extra of extraServices) {
      const { serviceId, quantity = 1 } = extra;
      const price = await ExtraServiceManager.calculatePrice(serviceId, quantity, distanceKm);
      extrasTotal += price;
      itemizedExtras.push({ serviceId, quantity, price });
    }

    total += extrasTotal;

    return NextResponse.json({
      packagePrice: total - extrasTotal,
      extrasTotal,
      total,
      itemizedExtras
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
