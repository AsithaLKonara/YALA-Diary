export class ProviderError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string, status = 500) {
    super(message);
    this.name = "ProviderError";
    this.code = code;
    this.status = status;
  }
}

export class HotelNotFoundError extends ProviderError {
  constructor(message = "The requested hotel could not be found.") {
    super(message, "HOTEL_NOT_FOUND", 404);
  }
}

export class RoomNotAvailableError extends ProviderError {
  constructor(message = "The requested room is no longer available.") {
    super(message, "ROOM_NOT_AVAILABLE", 409);
  }
}

export class RateChangedError extends ProviderError {
  constructor(message = "The price or rate has changed.") {
    super(message, "RATE_CHANGED", 409);
  }
}

export class ProviderTimeoutError extends ProviderError {
  constructor(message = "The connection to the provider timed out.") {
    super(message, "PROVIDER_TIMEOUT", 504);
  }
}

export class ProviderRateLimitError extends ProviderError {
  constructor(message = "Provider API rate limit exceeded.") {
    super(message, "PROVIDER_RATE_LIMIT", 429);
  }
}

export class BookingFailedError extends ProviderError {
  constructor(message = "Failed to create reservation.") {
    super(message, "BOOKING_FAILED", 502);
  }
}

export class CancellationFailedError extends ProviderError {
  constructor(message = "Failed to cancel reservation.") {
    super(message, "CANCELLATION_FAILED", 502);
  }
}
