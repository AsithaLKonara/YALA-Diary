import { describe, it, expect, vi } from 'vitest';
import { RevalidationService } from '../services/RevalidateAvailability';
import { SiteMinderClient } from '../providers/siteminder/client';

// Mock the module
vi.mock('../providers/siteminder/client', () => {
  return {
    SiteMinderClient: class {
      async getAvailability() {
        return [
          {
            hotelId: "SM-HOTEL-01",
            roomTypeId: "SM-RT-01",
            ratePlanId: "SM-RP-01",
            available: true,
            roomsAvailable: 5,
            price: { amount: 200, currency: "USD" },
            cancellation: { type: "Flexible", deadline: "2026-10-01T00:00:00Z" }
          }
        ];
      }
    }
  };
});

describe('Revalidation Service', () => {
  it('passes when room is available and price matches', async () => {
    const result = await RevalidationService.execute({
      hotelExternalId: "SM-HOTEL-01",
      roomTypeExternalId: "SM-RT-01",
      ratePlanExternalId: "SM-RP-01",
      checkIn: "2026-12-01",
      checkOut: "2026-12-05",
      adults: 2,
      children: 0,
      expectedPrice: 200
    });

    expect(result).toBe(true);
  });

  it('throws RateChangedError if price is different', async () => {
    await expect(RevalidationService.execute({
      hotelExternalId: "SM-HOTEL-01",
      roomTypeExternalId: "SM-RT-01",
      ratePlanExternalId: "SM-RP-01",
      checkIn: "2026-12-01",
      checkOut: "2026-12-05",
      adults: 2,
      children: 0,
      expectedPrice: 150 // Wrong price
    })).rejects.toThrow(/Price changed/);
  });

  it('throws RoomNotAvailableError if room is missing from availability payload', async () => {
    await expect(RevalidationService.execute({
      hotelExternalId: "SM-HOTEL-01",
      roomTypeExternalId: "SM-RT-02", // Different room type
      ratePlanExternalId: "SM-RP-01",
      checkIn: "2026-12-01",
      checkOut: "2026-12-05",
      adults: 2,
      children: 0,
      expectedPrice: 200
    })).rejects.toThrow(/requested room is no longer available/);
  });
});
