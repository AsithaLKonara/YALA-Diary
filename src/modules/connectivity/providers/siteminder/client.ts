import {
  HotelChannelProvider,
  Property,
  AvailabilityParams,
  AvailabilityResult,
  CreateReservationInput,
  Reservation,
  ModifyReservationInput,
  CancelReservationInput,
} from "../../core/interfaces/HotelChannelProvider";
import { ProviderTimeoutError, ProviderRateLimitError, ProviderError } from "../../core/errors";

export class SiteMinderClient implements HotelChannelProvider {
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor() {
    this.baseUrl = process.env.SITEMINDER_API_URL || "https://api.siteminder.com/sandbox/v1";
    this.apiKey = process.env.SITEMINDER_API_KEY || "";
    this.timeoutMs = 15000;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set("Content-Type", "application/json");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const startTime = Date.now();
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;
      
      // Structured logging without PII
      console.log(`[SiteMinder] ${options.method || "GET"} ${endpoint} - ${response.status} (${duration}ms)`);

      if (response.status === 429) {
        throw new ProviderRateLimitError();
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new ProviderError(`Provider Error: ${response.statusText}`, "PROVIDER_ERROR", response.status);
      }

      if (response.status !== 204) {
        return await response.json();
      }
      return {} as T;

    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new ProviderTimeoutError();
      }
      throw error;
    }
  }

  // --- Implementation of HotelChannelProvider ---
  
  async getProperties(): Promise<Property[]> {
    try {
      // In production, this would call: return await this.request<Property[]>("/properties");
      // Since SiteMinder sandbox might not have a reliable properties endpoint without configuration,
      // we provide a robust mock structure to test our mapper and UI.
      return [
        {
          id: "SM-HOTEL-01",
          name: "Yala Safari Lodge (SiteMinder Test)",
          address: "123 Safari Drive, Yala",
          facilities: ["WiFi", "Pool", "Restaurant"],
          images: ["https://example.com/yala1.jpg"],
          rawRoomTypes: [
            { id: "SM-RT-01", name: "Deluxe Tent", description: "Luxury tent", maxCapacity: 2, pricePerNight: 200 },
            { id: "SM-RT-02", name: "Family Suite", description: "Large suite", maxCapacity: 4, pricePerNight: 350 }
          ],
          rawRatePlans: [
            { id: "SM-RP-01", roomTypeId: "SM-RT-01", name: "Room Only", mealPlan: "None", cancellationPolicy: "Flexible" },
            { id: "SM-RP-02", roomTypeId: "SM-RT-01", name: "Bed & Breakfast", mealPlan: "Breakfast", cancellationPolicy: "Non-Refundable" }
          ]
        },
        {
          id: "SM-HOTEL-02",
          name: "Wild Trails Resort",
          address: "45 Jungle Road, Yala",
          facilities: ["WiFi", "Spa", "Safari Transfer"],
          images: [],
          rawRoomTypes: [
            { id: "SM-RT-03", name: "Standard Room", description: "Cozy room", maxCapacity: 2, pricePerNight: 150 }
          ],
          rawRatePlans: []
        }
      ];
    } catch (error) {
      console.error("Failed to fetch properties from SiteMinder", error);
      throw error;
    }
  }

  async getProperty(propertyId: string): Promise<Property> {
    const properties = await this.getProperties();
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) {
      throw new ProviderError("Property not found", "NOT_FOUND", 404);
    }
    return prop;
  }

  async getAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]> {
    try {
      // In production: return await this.request<AvailabilityResult[]>("/availability", { method: "POST", body: JSON.stringify(params) });
      
      // Sandbox mock logic:
      // We'll simulate availability for SM-HOTEL-01
      if (params.hotelId !== "SM-HOTEL-01") return [];

      // If user asks for more than 5 adults, simulate sold out for Deluxe Tent
      const isDeluxeSoldOut = params.adults > 5;
      const isFamilySuiteSoldOut = params.adults > 8;

      const results: AvailabilityResult[] = [];

      if (!isDeluxeSoldOut) {
        results.push({
          hotelId: params.hotelId,
          roomTypeId: "SM-RT-01",
          ratePlanId: "SM-RP-01",
          available: true,
          roomsAvailable: 5,
          price: { amount: 200, currency: "USD" },
          cancellation: { type: "Flexible", deadline: "2026-10-01T00:00:00Z" }
        });
        results.push({
          hotelId: params.hotelId,
          roomTypeId: "SM-RT-01",
          ratePlanId: "SM-RP-02",
          available: true,
          roomsAvailable: 5,
          price: { amount: 250, currency: "USD" },
          cancellation: { type: "Non-Refundable", deadline: "" }
        });
      }

      if (!isFamilySuiteSoldOut) {
        results.push({
          hotelId: params.hotelId,
          roomTypeId: "SM-RT-02",
          ratePlanId: "SM-RP-01", // Assuming family suite has a rate plan
          available: true,
          roomsAvailable: 2,
          price: { amount: 350, currency: "USD" },
          cancellation: { type: "Flexible", deadline: "2026-10-01T00:00:00Z" }
        });
      }

      return results;
    } catch (error) {
      console.error("Failed to fetch availability from SiteMinder", error);
      throw error;
    }
  }

  async createReservation(data: CreateReservationInput): Promise<Reservation> {
    return { id: "SM-RES-12345", status: "CONFIRMED" };
  }

  async modifyReservation(data: ModifyReservationInput): Promise<Reservation> {
    return { id: data.reservationId, status: "CONFIRMED" };
  }

  async cancelReservation(data: CancelReservationInput): Promise<void> {
    return;
  }
}
