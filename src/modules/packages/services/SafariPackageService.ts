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
  static async createPackage({
    extraServiceIds,
    ...data
  }: {
    name: string;
    type: SafariPackageType;
    startTime: string;
    endTime: string;
    basePrice: number;
    pricingType: PricingType;
    inclusions: string[];
    images?: string[];
    extraServiceIds?: string[];
  }): Promise<SafariPackage> {
    return prisma.safariPackage.create({
      data: {
        ...data,
        images: data.images || [],
        extraServices: extraServiceIds?.length ? {
          connect: extraServiceIds.map(id => ({ id }))
        } : undefined
      },
    });
  }

  /**
   * Updates an existing safari package.
   */
  static async updatePackage(
    id: string,
    {
      extraServiceIds,
      ...data
    }: Partial<{
      name: string;
      type: SafariPackageType;
      startTime: string;
      endTime: string;
      basePrice: number;
      pricingType: PricingType;
      inclusions: string[];
      images: string[];
      isActive: boolean;
      extraServiceIds: string[];
    }>
  ): Promise<SafariPackage> {
    return prisma.safariPackage.update({
      where: { id },
      data: {
        ...data,
        extraServices: extraServiceIds ? {
          set: extraServiceIds.map(serviceId => ({ id: serviceId }))
        } : undefined
      },
    });
  }

  /**
   * Deletes a safari package.
   */
  static async deletePackage(id: string): Promise<void> {
    await prisma.safariPackage.delete({
      where: { id },
    });
  }
}
