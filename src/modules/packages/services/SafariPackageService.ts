import { prisma } from "@/lib/prisma";
import { SafariPackage, SafariPackageType, PricingType } from "@/generated/prisma/client";
import { unlink } from "fs/promises";
import { join } from "path";

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
   * Retrieves a single package by ID with extra services included.
   */
  static async getPackageById(id: string) {
    return prisma.safariPackage.findUnique({
      where: { id },
      include: { extraServices: true }
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
    pricingRules?: any;
    minGuests?: number;
    maxCapacity?: number;
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
      pricingRules: any;
      minGuests: number;
      maxCapacity: number;
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
    const pkg = await prisma.safariPackage.findUnique({ where: { id } });
    if (!pkg) return;

    const bookingCount = await prisma.safariBooking.count({
      where: { packageId: id }
    });
    if (bookingCount > 0) {
      throw new Error("Cannot delete this package because it has existing bookings. Please edit it and set it to Inactive instead.");
    }
    
    await prisma.safariPackage.delete({
      where: { id },
    });

    if (pkg.images && pkg.images.length > 0) {
      for (const imgUrl of pkg.images) {
        if (imgUrl.startsWith("/uploads/")) {
          const filepath = join(process.cwd(), "public", imgUrl);
          try {
            await unlink(filepath);
          } catch (e) {
            console.error(`Failed to delete image file: ${filepath}`, e);
          }
        }
      }
    }
  }
}
