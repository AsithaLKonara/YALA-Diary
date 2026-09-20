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
    // For sandbox Phase 1, we return mock properties.
    // In Phase 2, this will call `this.request("/properties")`
    return [
      { id: "SM-001", name: "Yala Safari Lodge (SiteMinder Test)", address: "Test Addr", facilities: ["WiFi"], images: [] }
    ];
  }

  async getProperty(propertyId: string): Promise<Property> {
    return { id: propertyId, name: "Yala Safari Lodge (SiteMinder Test)", address: "Test Addr", facilities: ["WiFi"], images: [] };
  }

  async getAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]> {
    return [];
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
