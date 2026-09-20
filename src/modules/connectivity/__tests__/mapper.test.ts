import { describe, it, expect } from 'vitest';
import { mapPropertyToDomain } from '../providers/siteminder/mapper';

describe('SiteMinder Mapper', () => {
  it('maps SiteMinder property to Yala Hotel format correctly', () => {
    const rawProperty: any = {
      id: 'SM-HOTEL-TEST',
      name: 'Yala Sandbox Lodge',
      address: 'Test Addr',
      facilities: ['WiFi'],
      images: ['img1.jpg'],
      rawRoomTypes: [
        {
          id: 'RT-1',
          name: 'Deluxe',
          description: 'A test room',
          maxCapacity: 2,
          pricePerNight: 100
        }
      ],
      rawRatePlans: [
        {
          id: 'RP-1',
          roomTypeId: 'RT-1',
          name: 'Room Only',
          mealPlan: 'None',
          cancellationPolicy: 'Strict'
        }
      ]
    };

    const result = mapPropertyToDomain(rawProperty);

    expect(result.externalId).toBe('SM-HOTEL-TEST');
    expect(result.name).toBe('Yala Sandbox Lodge');
    expect(result.roomTypes.length).toBe(1);
    expect(result.roomTypes[0].externalId).toBe('RT-1');
    expect(result.roomTypes[0].pricePerNight).toBe(100);
    expect(result.ratePlans.length).toBe(1);
    expect(result.ratePlans[0].externalId).toBe('RP-1');
    expect(result.ratePlans[0].mealPlan).toBe('None');
  });

  it('handles empty arrays', () => {
    const rawProperty: any = {
      id: 'SM-HOTEL-EMPTY',
      name: 'Empty Hotel',
      address: '',
      facilities: [],
      images: [],
      rawRoomTypes: [],
      rawRatePlans: []
    };

    const result = mapPropertyToDomain(rawProperty);
    expect(result.roomTypes.length).toBe(0);
  });
});
