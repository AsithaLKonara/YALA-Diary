// ─────────────────────────────────────────────
// Admin Mock Data — Yala Diary
// ─────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";

export interface Booking {
  id: string;
  ref: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  status: BookingStatus;
  revenue: number;
  currency: string;
  addOns: string[];
  specialRequests: string;
  createdAt: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalBookings: number;
  totalSpend: number;
  lastStay: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  status: "available" | "occupied" | "maintenance";
  capacity: number;
  currentGuest?: string;
  checkOut?: string;
  pricePerNight: number;
}

export interface SafariSlot {
  id: string;
  date: string;
  slot: "AM" | "PM";
  capacity: number;
  booked: number;
  guide: string;
  guests: string[];
}

// ─── Bookings ────────────────────────────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1", ref: "YD-2026-0001", guestName: "James Attenborough", guestEmail: "james@example.com",
    guestPhone: "+44 7700 900123", guestCountry: "United Kingdom", room: "101", roomType: "Deluxe Tent",
    checkIn: "2026-09-22", checkOut: "2026-09-25", nights: 3, adults: 2, children: 0,
    status: "confirmed", revenue: 1485, currency: "USD",
    addOns: ["AM Safari", "Dinner Package", "Airport Transfer"],
    specialRequests: "Vegetarian meals preferred. Quiet room away from generator.",
    createdAt: "2026-09-10T09:23:00Z",
  },
  {
    id: "2", ref: "YD-2026-0002", guestName: "Nathalie Dupont", guestEmail: "nathalie@example.fr",
    guestPhone: "+33 6 12 34 56 78", guestCountry: "France", room: "103", roomType: "Premium Suite",
    checkIn: "2026-09-23", checkOut: "2026-09-26", nights: 3, adults: 2, children: 1,
    status: "confirmed", revenue: 2310, currency: "USD",
    addOns: ["AM Safari", "PM Safari", "Lunch Package"],
    specialRequests: "Child-friendly arrangements. High chair needed.",
    createdAt: "2026-09-12T14:05:00Z",
  },
  {
    id: "3", ref: "YD-2026-0003", guestName: "Hiroshi Tanaka", guestEmail: "hiroshi@example.jp",
    guestPhone: "+81 90 1234 5678", guestCountry: "Japan", room: "105", roomType: "Deluxe Tent",
    checkIn: "2026-09-20", checkOut: "2026-09-23", nights: 3, adults: 2, children: 0,
    status: "checked_in", revenue: 1485, currency: "USD",
    addOns: ["PM Safari", "Spa Treatment"],
    specialRequests: "",
    createdAt: "2026-09-08T07:30:00Z",
  },
  {
    id: "4", ref: "YD-2026-0004", guestName: "Elena Vasquez", guestEmail: "elena@example.es",
    guestPhone: "+34 612 345 678", guestCountry: "Spain", room: "102", roomType: "Family Chalet",
    checkIn: "2026-09-18", checkOut: "2026-09-21", nights: 3, adults: 2, children: 2,
    status: "checked_out", revenue: 2850, currency: "USD",
    addOns: ["AM Safari", "Full Board"],
    specialRequests: "Kids menu required.",
    createdAt: "2026-09-01T11:00:00Z",
  },
  {
    id: "5", ref: "YD-2026-0005", guestName: "David Okafor", guestEmail: "david@example.ng",
    guestPhone: "+234 801 234 5678", guestCountry: "Nigeria", room: "107", roomType: "Premium Suite",
    checkIn: "2026-09-28", checkOut: "2026-10-02", nights: 4, adults: 1, children: 0,
    status: "pending", revenue: 2200, currency: "USD",
    addOns: ["AM Safari", "PM Safari"],
    specialRequests: "Late check-in expected around 23:00.",
    createdAt: "2026-09-19T16:45:00Z",
  },
  {
    id: "6", ref: "YD-2026-0006", guestName: "Sarah Mitchell", guestEmail: "sarah@example.au",
    guestPhone: "+61 4 1234 5678", guestCountry: "Australia", room: "104", roomType: "Deluxe Tent",
    checkIn: "2026-09-30", checkOut: "2026-10-03", nights: 3, adults: 2, children: 0,
    status: "pending", revenue: 1485, currency: "USD",
    addOns: ["Breakfast Only"],
    specialRequests: "Anniversary trip — flowers in room if possible.",
    createdAt: "2026-09-19T20:00:00Z",
  },
  {
    id: "7", ref: "YD-2026-0007", guestName: "Marco Ricci", guestEmail: "marco@example.it",
    guestPhone: "+39 345 678 9012", guestCountry: "Italy", room: "106", roomType: "Deluxe Tent",
    checkIn: "2026-09-15", checkOut: "2026-09-18", nights: 3, adults: 2, children: 0,
    status: "cancelled", revenue: 0, currency: "USD",
    addOns: [],
    specialRequests: "Cancelled due to travel disruption.",
    createdAt: "2026-08-30T09:00:00Z",
  },
  {
    id: "8", ref: "YD-2026-0008", guestName: "Priya Sharma", guestEmail: "priya@example.in",
    guestPhone: "+91 98765 43210", guestCountry: "India", room: "108", roomType: "Premium Suite",
    checkIn: "2026-10-05", checkOut: "2026-10-09", nights: 4, adults: 2, children: 1,
    status: "confirmed", revenue: 3100, currency: "USD",
    addOns: ["AM Safari", "PM Safari", "Full Board", "Spa Treatment"],
    specialRequests: "Vegan meals. No pork.",
    createdAt: "2026-09-18T10:30:00Z",
  },
];

// ─── Guests ──────────────────────────────────

export const MOCK_GUESTS: Guest[] = [
  { id: "g1", name: "James Attenborough", email: "james@example.com", phone: "+44 7700 900123", country: "United Kingdom", totalBookings: 3, totalSpend: 4200, lastStay: "2026-09-25" },
  { id: "g2", name: "Nathalie Dupont", email: "nathalie@example.fr", phone: "+33 6 12 34 56 78", country: "France", totalBookings: 2, totalSpend: 4620, lastStay: "2026-09-26" },
  { id: "g3", name: "Hiroshi Tanaka", email: "hiroshi@example.jp", phone: "+81 90 1234 5678", country: "Japan", totalBookings: 1, totalSpend: 1485, lastStay: "2026-09-23" },
  { id: "g4", name: "Elena Vasquez", email: "elena@example.es", phone: "+34 612 345 678", country: "Spain", totalBookings: 4, totalSpend: 8900, lastStay: "2026-09-21" },
  { id: "g5", name: "David Okafor", email: "david@example.ng", phone: "+234 801 234 5678", country: "Nigeria", totalBookings: 1, totalSpend: 2200, lastStay: "2026-10-02" },
  { id: "g6", name: "Sarah Mitchell", email: "sarah@example.au", phone: "+61 4 1234 5678", country: "Australia", totalBookings: 2, totalSpend: 3200, lastStay: "2026-10-03" },
  { id: "g7", name: "Priya Sharma", email: "priya@example.in", phone: "+91 98765 43210", country: "India", totalBookings: 1, totalSpend: 3100, lastStay: "2026-10-09" },
];

// ─── Rooms ───────────────────────────────────

export const MOCK_ROOMS: Room[] = [
  { id: "r1", number: "101", type: "Deluxe Tent", status: "occupied", capacity: 2, currentGuest: "James Attenborough", checkOut: "2026-09-25", pricePerNight: 495 },
  { id: "r2", number: "102", type: "Family Chalet", status: "available", capacity: 4, pricePerNight: 750 },
  { id: "r3", number: "103", type: "Premium Suite", status: "occupied", capacity: 3, currentGuest: "Nathalie Dupont", checkOut: "2026-09-26", pricePerNight: 770 },
  { id: "r4", number: "104", type: "Deluxe Tent", status: "available", capacity: 2, pricePerNight: 495 },
  { id: "r5", number: "105", type: "Deluxe Tent", status: "occupied", capacity: 2, currentGuest: "Hiroshi Tanaka", checkOut: "2026-09-23", pricePerNight: 495 },
  { id: "r6", number: "106", type: "Deluxe Tent", status: "maintenance", capacity: 2, pricePerNight: 495 },
  { id: "r7", number: "107", type: "Premium Suite", status: "available", capacity: 2, pricePerNight: 770 },
  { id: "r8", number: "108", type: "Premium Suite", status: "available", capacity: 3, pricePerNight: 770 },
  { id: "r9", number: "201", type: "Deluxe Tent", status: "available", capacity: 2, pricePerNight: 495 },
  { id: "r10", number: "202", type: "Family Chalet", status: "available", capacity: 4, pricePerNight: 750 },
  { id: "r11", number: "203", type: "Deluxe Tent", status: "maintenance", capacity: 2, pricePerNight: 495 },
  { id: "r12", number: "204", type: "Luxury Villa", status: "available", capacity: 6, pricePerNight: 1200 },
];

// ─── Safari Slots ─────────────────────────────

export const MOCK_SAFARIS: SafariSlot[] = [
  { id: "s1", date: "2026-09-20", slot: "AM", capacity: 6, booked: 4, guide: "Ruwan Perera", guests: ["Hiroshi Tanaka", "James Attenborough", "Sarah M.", "David O."] },
  { id: "s2", date: "2026-09-20", slot: "PM", capacity: 6, booked: 2, guide: "Chamara Silva", guests: ["Hiroshi Tanaka", "Nathalie Dupont"] },
  { id: "s3", date: "2026-09-21", slot: "AM", capacity: 6, booked: 3, guide: "Ruwan Perera", guests: ["James Attenborough", "Elena Vasquez", "Priya Sharma"] },
  { id: "s4", date: "2026-09-21", slot: "PM", capacity: 6, booked: 6, guide: "Kasun Jayawardena", guests: ["Nathalie Dupont", "Hiroshi Tanaka", "Sarah M.", "David O.", "Marco R.", "Elena V."] },
  { id: "s5", date: "2026-09-22", slot: "AM", capacity: 6, booked: 1, guide: "Chamara Silva", guests: ["James Attenborough"] },
  { id: "s6", date: "2026-09-22", slot: "PM", capacity: 6, booked: 0, guide: "Ruwan Perera", guests: [] },
];

// ─── Revenue Chart Data ───────────────────────

export const MONTHLY_REVENUE = [
  { month: "Apr", revenue: 18400 },
  { month: "May", revenue: 22100 },
  { month: "Jun", revenue: 19800 },
  { month: "Jul", revenue: 31200 },
  { month: "Aug", revenue: 38600 },
  { month: "Sep", revenue: 29400 },
];

export const OCCUPANCY_DATA = [
  { month: "Apr", rate: 62 },
  { month: "May", rate: 71 },
  { month: "Jun", rate: 68 },
  { month: "Jul", rate: 88 },
  { month: "Aug", rate: 94 },
  { month: "Sep", rate: 79 },
];
