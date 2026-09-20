import { SiteMinderClient } from "../providers/siteminder/client";
import { RoomNotAvailableError, RateChangedError } from "../core/errors";

export class RevalidationService {
  static async execute(params: {
    hotelExternalId: string;
    roomTypeExternalId: string;
    ratePlanExternalId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    expectedPrice: number;
  }) {
    const client = new SiteMinderClient();
    
    // Strict live API call (bypasses our internal short-lived cache)
    const availability = await client.getAvailability({
      hotelId: params.hotelExternalId,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: params.adults,
      children: params.children,
    });

    const specificRate = availability.find(
      (a) => a.hotelId === params.hotelExternalId && 
             a.roomTypeId === params.roomTypeExternalId &&
             a.ratePlanId === params.ratePlanExternalId
    );

    if (!specificRate || !specificRate.available || specificRate.roomsAvailable <= 0) {
      throw new RoomNotAvailableError();
    }

    if (specificRate.price.amount !== params.expectedPrice) {
      throw new RateChangedError(`Price changed from ${params.expectedPrice} to ${specificRate.price.amount}`);
    }

    return true;
  }
}
