import { prisma } from "@/lib/prisma";
import { ExtraService, PricingModel } from "@/generated/prisma/client";

export class ExtraServiceManager {
  /**
   * Retrieves all active extra services.
   */
  static async listActiveServices(): Promise<ExtraService[]> {
    return prisma.extraService.findMany({
      where: { isActive: true },
      orderBy: { category: "asc" },
    });
  }

  /**
   * Retrieves all extra services (for admin).
   */
  static async listAllServices(): Promise<ExtraService[]> {
    return prisma.extraService.findMany({
      orderBy: { category: "asc" },
    });
  }

  /**
   * Creates a new extra service.
   */
  static async createService(data: {
    name: string;
    description?: string;
    category: string;
    pricingModel: PricingModel;
    basePrice: number;
    perKmRate?: number;
    images?: string[];
  }): Promise<ExtraService> {
    return prisma.extraService.create({
      data: {
        ...data,
        images: data.images || []
      },
    });
  }

  /**
   * Updates an existing extra service.
   */
  static async updateService(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      category: string;
      pricingModel: PricingModel;
      basePrice: number;
      perKmRate: number;
      images: string[];
      isActive: boolean;
    }>
  ): Promise<ExtraService> {
    return prisma.extraService.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes an extra service.
   */
  static async deleteService(id: string): Promise<void> {
    await prisma.extraService.delete({
      where: { id },
    });
  }

  /**
   * Dynamic pricing engine that evaluates the price based on PricingModel.
   * @param serviceId The ID of the extra service
   * @param quantity The quantity (e.g., number of persons)
   * @param distanceKm The distance in km (if applicable)
   */
  static async calculatePrice(
    serviceId: string,
    quantity: number = 1,
    distanceKm: number = 0
  ): Promise<number> {
    const service = await prisma.extraService.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    switch (service.pricingModel) {
      case "FLAT_RATE":
        return service.basePrice;
      
      case "PER_PERSON":
        return service.basePrice * quantity;
      
      case "PER_KM":
        // E.g., Free 20km calculation logic could be injected here or handled at the booking level
        // Assuming base price covers initial fees, and perKmRate applies to distance.
        const perKmRate = service.perKmRate || 0;
        return service.basePrice + (distanceKm * perKmRate);
      
      default:
        return 0;
    }
  }
}
