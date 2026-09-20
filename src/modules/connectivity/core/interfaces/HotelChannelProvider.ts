export interface Property {
  id: string;
  name: string;
  address: string;
  facilities: string[];
  images: string[];
  // raw provider data
  [key: string]: any;
}

export interface RoomInfo {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;
  pricePerNight: number;
}

export interface RateInfo {
  id: string;
  roomTypeId: string;
  name: string;
  mealPlan: string;
  cancellationPolicy: string;
}

export interface AvailabilityParams {
  hotelId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
}

export interface AvailabilityResult {
  hotelId: string;
  roomTypeId: string;
  ratePlanId: string;
  available: boolean;
  roomsAvailable: number;
  price: {
    amount: number;
    currency: string;
  };
  cancellation: {
    type: string;
    deadline: string;
  };
}

export interface CreateReservationInput {
  hotelId: string;
  roomTypeId: string;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  price: {
    amount: number;
    currency: string;
  };
}

export interface ModifyReservationInput {
  reservationId: string; // External ID
  checkIn?: string;
  checkOut?: string;
}

export interface CancelReservationInput {
  reservationId: string; // External ID
  reason?: string;
}

export interface Reservation {
  id: string; // External ID
  status: string; // CONFIRMED, CANCELLED
}

export interface HotelChannelProvider {
  getProperties(): Promise<Property[]>;
  getProperty(propertyId: string): Promise<Property>;
  getAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]>;
  createReservation(data: CreateReservationInput): Promise<Reservation>;
  modifyReservation(data: ModifyReservationInput): Promise<Reservation>;
  cancelReservation(data: CancelReservationInput): Promise<void>;
}
