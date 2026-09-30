import { prisma } from "@/lib/prisma";
import { SafariPackage, SafariPackageType, PricingType } from "@/generated/prisma/client";

export class SafariPackageService {
  /**
   * Retrieves all active safari packages.
   */
  static async listActivePackages(): Promise<SafariPackage[]> {
    return prisma.safariPackage.findMany({
      where: { isActive: true },
      orderBy: { basePrice: "asc" },
    });
  }

  /**
   * Retrieves all safari packages (for admin).
   */
  static async listAllPackages(): Promise<SafariPackage[]> {
    return prisma.safariPackage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Creates a new safari package.
   */
  static async createPackage(data: {
    name: string;
    type: SafariPackageType;
    startTime: string;
    endTime: string;
    basePrice: number;
    pricingType: PricingType;
    inclusions: string[];
  }): Promise<SafariPackage> {
    return prisma.safariPackage.create({
      data,
    });
  }

  /**
   * Updates an existing safari package.
   */
  static async updatePackage(
    id: string,
    data: Partial<{
      name: string;
      type: SafariPackageType;
      startTime: string;
      endTime: string;
      basePrice: number;
      pricingType: PricingType;
      inclusions: string[];
      isActive: boolean;
    }>
  ): Promise<SafariPackage> {
    return prisma.safariPackage.update({
      where: { id },
      data,
    });
  }
}
