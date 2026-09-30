import { prisma } from "@/lib/prisma";

export class ScraperService {
  static async scrapeAndStoreTicketPrices() {
    // Deprecated: Tickets are now managed via Admin Dashboard
    return { success: true, count: 0, prices: [] };
  }
  
  static async insertFallbackPrices() {
    // Deprecated
  }

  static async getTicketPrices() {
    return prisma.entranceTicket.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
  }
}
