/**
 * Pricing Engine — pure functions to calculate costs from pricing rules.
 * No database calls here — pass in the rules and guest counts.
 */

// ─── Safari Package Pricing ──────────────────────────────────────────────────

export type SafariPricingStrategy =
  | "PER_PERSON_WITH_CHILD"
  | "GROUP_TIERED"
  | "PRIVATE_FLAT";

export interface GroupTier {
  minGuests: number;
  maxGuests: number;
  jeepPrice: number;
}

export interface SafariPricingRules {
  strategyType: SafariPricingStrategy;
  // PER_PERSON_WITH_CHILD
  adultRate?: number;
  childRate?: number;
  childFreeBelow?: number; // e.g. 3 → children under 3 are free
  // GROUP_TIERED
  tiers?: GroupTier[];
  // PRIVATE_FLAT
  privateRate?: number;
  
  // Extra Person Charge (For Flat/Tiered strategies when exceeding included limit)
  baseCapacity?: number;
  extraPersonRate?: number;

  // Universal
  maxCapacity: number;
  minGuests: number;
}

export interface SafariPriceBreakdown {
  totalPrice: number;
  lines: { label: string; amount: number }[];
  valid: boolean;
  validationError?: string;
}

export function calculateSafariPrice(
  rules: SafariPricingRules,
  adults: number,
  children: number
): SafariPriceBreakdown {
  const totalGuests = adults + children;

  // Validate capacity
  if (totalGuests < rules.minGuests) {
    return {
      totalPrice: 0,
      lines: [],
      valid: false,
      validationError: `Minimum ${rules.minGuests} guest${rules.minGuests !== 1 ? "s" : ""} required.`,
    };
  }
  if (totalGuests > rules.maxCapacity) {
    return {
      totalPrice: 0,
      lines: [],
      valid: false,
      validationError: `Maximum capacity is ${rules.maxCapacity} guests.`,
    };
  }

  const lines: { label: string; amount: number }[] = [];

  if (rules.strategyType === "PRIVATE_FLAT") {
    let price = rules.privateRate ?? 0;
    const baseCap = rules.baseCapacity ?? rules.maxCapacity;
    lines.push({ label: `Private Jeep (up to ${baseCap} pax)`, amount: price });
    
    if (totalGuests > baseCap && rules.extraPersonRate) {
      const extraGuests = totalGuests - baseCap;
      const extraCost = extraGuests * rules.extraPersonRate;
      price += extraCost;
      lines.push({ label: `Additional guests (${extraGuests} × $${rules.extraPersonRate})`, amount: extraCost });
    }
    
    return { totalPrice: price, lines, valid: true };
  }

  if (rules.strategyType === "GROUP_TIERED") {
    const tiers = rules.tiers ?? [];
    let matched = tiers.find(
      (t) => totalGuests >= t.minGuests && totalGuests <= t.maxGuests
    );
    
    // Fallback: If we exceed the highest tier and have an extraPersonRate, use highest tier as base
    if (!matched && rules.extraPersonRate && tiers.length > 0) {
      const highestTier = tiers.reduce((prev, current) => (prev.maxGuests > current.maxGuests) ? prev : current);
      if (totalGuests > highestTier.maxGuests) {
        matched = highestTier;
      }
    }

    if (!matched) {
      return {
        totalPrice: 0,
        lines: [],
        valid: false,
        validationError: "No pricing tier matches this guest count.",
      };
    }
    
    let price = matched.jeepPrice;
    lines.push({
      label: `Jeep for ${totalGuests > matched.maxGuests ? matched.maxGuests : totalGuests} guest${totalGuests !== 1 ? "s" : ""} (${matched.minGuests}–${matched.maxGuests} pax tier)`,
      amount: matched.jeepPrice,
    });
    
    if (totalGuests > matched.maxGuests && rules.extraPersonRate) {
      const extraGuests = totalGuests - matched.maxGuests;
      const extraCost = extraGuests * rules.extraPersonRate;
      price += extraCost;
      lines.push({ label: `Additional guests (${extraGuests} × $${rules.extraPersonRate})`, amount: extraCost });
    }

    return { totalPrice: price, lines, valid: true };
  }

  // PER_PERSON_WITH_CHILD
  const adultRate = rules.adultRate ?? 0;
  const childRate = rules.childRate ?? 0;
  const freeBelow = rules.childFreeBelow ?? 0;

  const adultCost = adults * adultRate;
  const paidChildren = children; // Could subtract freeBelow children if needed
  const childCost = paidChildren * childRate;

  if (adults > 0) lines.push({ label: `${adults} Adult${adults !== 1 ? "s" : ""} × $${adultRate}`, amount: adultCost });
  if (paidChildren > 0) lines.push({ label: `${paidChildren} Child${paidChildren !== 1 ? "ren" : ""} × $${childRate}`, amount: childCost });
  if (freeBelow > 0 && children > 0) lines.push({ label: `Children under ${freeBelow} free`, amount: 0 });

  const totalPrice = adultCost + childCost;
  return { totalPrice, lines, valid: true };
}

// ─── Extra Service Pricing ────────────────────────────────────────────────────

export type ServicePricingStrategy =
  | "FLAT"
  | "PER_PERSON"
  | "PER_KM"
  | "TIERED_OPTIONS";

export interface PricingDimension {
  label: string; // e.g. "Pickup Location"
  key: string;   // e.g. "location"
  options: string[]; // e.g. ["Colombo", "Mattala", "Galle"]
}

export interface ServicePricingTier {
  label: string;                       // Human label for this tier
  conditions: Record<string, string>;  // { location: "Colombo", vehicle: "Van" }
  price: number;
}

export interface ServicePricingOptions {
  strategyType: ServicePricingStrategy;
  // FLAT
  flatPrice?: number;
  // PER_PERSON
  adultRate?: number;
  childRate?: number;
  // PER_KM
  baseRate?: number;
  perKmRate?: number;
  // TIERED_OPTIONS
  dimensions?: PricingDimension[];
  tiers?: ServicePricingTier[];
}

export interface ServicePriceBreakdown {
  totalPrice: number;
  lines: { label: string; amount: number }[];
  selectedOptions?: Record<string, string>;
  valid: boolean;
  validationError?: string;
}

export function calculateServicePrice(
  options: ServicePricingOptions,
  adults: number,
  children: number,
  selectedOptions?: Record<string, string>,
  distanceKm?: number
): ServicePriceBreakdown {
  const lines: { label: string; amount: number }[] = [];

  if (options.strategyType === "FLAT") {
    const price = options.flatPrice ?? 0;
    lines.push({ label: "Flat Rate", amount: price });
    return { totalPrice: price, lines, valid: true };
  }

  if (options.strategyType === "PER_PERSON") {
    const adultRate = options.adultRate ?? 0;
    const childRate = options.childRate ?? 0;
    const adultCost = adults * adultRate;
    const childCost = children * childRate;
    if (adults > 0) lines.push({ label: `${adults} Adult${adults !== 1 ? "s" : ""} × $${adultRate}`, amount: adultCost });
    if (children > 0) lines.push({ label: `${children} Child${children !== 1 ? "ren" : ""} × $${childRate}`, amount: childCost });
    return { totalPrice: adultCost + childCost, lines, valid: true };
  }

  if (options.strategyType === "PER_KM") {
    const base = options.baseRate ?? 0;
    const km = distanceKm ?? 0;
    const kmCost = km * (options.perKmRate ?? 0);
    if (base > 0) lines.push({ label: "Base charge", amount: base });
    if (km > 0) lines.push({ label: `${km} km × $${options.perKmRate}`, amount: kmCost });
    return { totalPrice: base + kmCost, lines, valid: true };
  }

  // TIERED_OPTIONS — match selected dimension values to a tier
  if (options.strategyType === "TIERED_OPTIONS") {
    if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
      return { totalPrice: 0, lines: [], valid: false, validationError: "Please select all options." };
    }
    const tiers = options.tiers ?? [];
    const matched = tiers.find((tier) =>
      Object.entries(tier.conditions).every(
        ([key, val]) => selectedOptions[key] === val
      )
    );
    if (!matched) {
      return { totalPrice: 0, lines: [], valid: false, validationError: "No pricing found for this selection." };
    }
    lines.push({ label: matched.label, amount: matched.price });
    return { totalPrice: matched.price, lines, selectedOptions, valid: true };
  }

  return { totalPrice: 0, lines: [], valid: false, validationError: "Unknown pricing strategy." };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get the minimum possible price for display purposes (e.g. "From $X") */
export function getDisplayMinPrice(rules: SafariPricingRules): number {
  if (rules.strategyType === "PRIVATE_FLAT") return rules.privateRate ?? 0;
  if (rules.strategyType === "GROUP_TIERED") {
    const tiers = rules.tiers ?? [];
    return tiers.length > 0 ? Math.min(...tiers.map((t) => t.jeepPrice)) : 0;
  }
  // PER_PERSON_WITH_CHILD — show per adult rate
  return rules.adultRate ?? 0;
}

export function getDisplayMinPriceLabel(rules: SafariPricingRules): string {
  if (rules.strategyType === "PRIVATE_FLAT") return "/ private jeep";
  if (rules.strategyType === "GROUP_TIERED") return `/ jeep (from ${rules.minGuests} pax)`;
  return "/ adult";
}
