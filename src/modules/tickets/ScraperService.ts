import * as cheerio from "cheerio";
import { prisma } from "@/lib/prisma";

const SCRAPE_URL = "https://www.yalasrilanka.lk/yala-safari-ride";

export class ScraperService {
  static async scrapeAndStoreTicketPrices() {
    try {
      const response = await fetch(SCRAPE_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${SCRAPE_URL}: ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // The prices are inside a `<p>` tag that has the block names in bold `<b>` usually.
      // Let's get all the text content of the page and use a regex to be resilient to HTML structure changes.
      const textContent = $('body').text();
      
      // Match pattern: "Block 1 (Palatupana) - Half-day LKR 21,450/="
      // We will look for anything that starts with "Block", followed by some text and "(...)", then "- Half-day" or "- Full-day", then "LKR", then the price.
      const regex = /(Block\s+[\d&]+\s*\([\w\s]+\))\s*-\s*(Half-day|Full-day)[\s\S]{0,50}?LKR\s*([\d,]+)/gi;
      
      let match;
      const prices = [];
      
      while ((match = regex.exec(textContent)) !== null) {
        const blockName = match[1].trim();
        const duration = match[2].trim();
        const priceStr = match[3].replace(/,/g, '');
        const priceLkr = parseFloat(priceStr);
        
        prices.push({
          blockName,
          duration,
          priceLkr
        });
      }
      
      if (prices.length === 0) {
        // Fallback or alert if scraping failed to find anything
        console.warn("Ticket Scraper: Could not find any prices using regex. The website layout or text might have changed.");
        
        // As a fallback, we will insert the known default prices if the database is empty, 
        // to ensure the system keeps working even if the first scrape fails.
        const count = await prisma.parkTicketPrice.count();
        if (count === 0) {
          await this.insertFallbackPrices();
        }
        return { success: false, message: "No prices found", prices: [] };
      }
      
      // Update database
      // Clear existing prices and insert new ones to keep it fresh
      await prisma.$transaction(async (tx) => {
        await tx.parkTicketPrice.deleteMany({});
        await tx.parkTicketPrice.createMany({
          data: prices
        });
      });
      
      return { success: true, count: prices.length, prices };
    } catch (error: any) {
      console.error("Ticket Scraper Error:", error);
      throw error;
    }
  }
  
  static async insertFallbackPrices() {
    const fallbackPrices = [
      { blockName: "Block 1 (Palatupana)", duration: "Half-day", priceLkr: 21450 },
      { blockName: "Block 1 (Palatupana)", duration: "Full-day", priceLkr: 31350 },
      { blockName: "Block 1 (Katagamuwa)", duration: "Half-day", priceLkr: 21450 },
      { blockName: "Block 1 (Katagamuwa)", duration: "Full-day", priceLkr: 31350 },
      { blockName: "Blocks 5&6 (Galge)", duration: "Half-day", priceLkr: 23100 },
      { blockName: "Blocks 5&6 (Galge)", duration: "Full-day", priceLkr: 32900 }
    ];
    
    await prisma.parkTicketPrice.createMany({
      data: fallbackPrices
    });
  }

  static async getTicketPrices() {
    return prisma.parkTicketPrice.findMany({
      orderBy: [
        { blockName: 'asc' },
        { duration: 'asc' }
      ]
    });
  }
}
