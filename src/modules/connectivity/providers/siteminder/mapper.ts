import { Property } from "../../core/interfaces/HotelChannelProvider";

export function mapPropertyToDomain(raw: Property) {
  return {
    externalId: raw.id,
    name: raw.name,
    description: raw.description || "",
    address: raw.address || "",
    facilities: raw.facilities || [],
    images: raw.images || [],
    active: false, // Default to inactive until admin publishes
    // Map room types
    roomTypes: (raw.rawRoomTypes || []).map((rt: any) => ({
      externalId: rt.id,
      name: rt.name,
      description: rt.description || "",
      maxCapacity: rt.maxCapacity,
      pricePerNight: rt.pricePerNight,
      active: true
    })),
    // Map rate plans
    ratePlans: (raw.rawRatePlans || []).map((rp: any) => ({
      externalId: rp.id,
      roomTypeExternalId: rp.roomTypeId,
      name: rp.name,
      mealPlan: rp.mealPlan || "None",
      cancellationPolicy: rp.cancellationPolicy || "Standard",
      active: true
    }))
  };
}
