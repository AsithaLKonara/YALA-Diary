// prisma/seed.ts — Development seed script
// Creates admin, staff, and guest accounts for local development
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

// ─── Seed users ───────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    name: "Yala Admin",
    email: "admin@yaladiary.com",
    password: "Admin@2026!",
    role: "ADMIN" as const,
  },
  {
    name: "Reception Staff",
    email: "staff@yaladiary.com",
    password: "Staff@2026!",
    role: "STAFF" as const,
  },
  {
    name: "Test Guest",
    email: "guest@yaladiary.com",
    password: "Guest@2026!",
    role: "GUEST" as const,
  },
];

// ─── Seed room types & rooms ──────────────────────────────────────────────────
const ROOM_TYPES = [
  { name: "Deluxe Tent",   description: "Premium canvas eco-tent with private deck.", maxCapacity: 2, pricePerNight: 495 },
  { name: "Family Chalet", description: "Spacious chalet suited for families.",        maxCapacity: 4, pricePerNight: 750 },
  { name: "Premium Suite", description: "Air-conditioned suite with panoramic views.", maxCapacity: 3, pricePerNight: 770 },
  { name: "Luxury Villa",  description: "Private villa with plunge pool and butler.",  maxCapacity: 6, pricePerNight: 1200 },
];

const ROOMS_BY_TYPE: Record<string, string[]> = {
  "Deluxe Tent":   ["101", "104", "105", "201", "203"],
  "Family Chalet": ["102", "202"],
  "Premium Suite": ["103", "107", "108"],
  "Luxury Villa":  ["204"],
};

// ─── Seed add-on services ──────────────────────────────────────────────────────
const ADD_ONS = [
  { name: "AM Safari",         description: "Early morning jeep safari into the park.", price: 85,  category: "SAFARI",    active: true },
  { name: "PM Safari",         description: "Afternoon wildlife drive at golden hour.",  price: 85,  category: "SAFARI",    active: true },
  { name: "Full Board",        description: "All meals included (breakfast, lunch, dinner).", price: 120, category: "FOOD", active: true },
  { name: "Dinner Package",    description: "Candlelit bush dinner experience.",          price: 65,  category: "FOOD",      active: true },
  { name: "Breakfast Only",    description: "Sri Lankan and continental breakfast.",      price: 35,  category: "FOOD",      active: true },
  { name: "Lunch Package",     description: "Poolside lunch with local cuisine.",         price: 45,  category: "FOOD",      active: true },
  { name: "Spa Treatment",     description: "60-minute ayurvedic massage.",               price: 110, category: "SPA",       active: true },
  { name: "Airport Transfer",  description: "Private airport transfer (Colombo/Mattala).", price: 75, category: "TRANSPORT", active: true },
];

async function main() {
  console.log("🌿 Seeding Yala Diary development database…\n");

  // ─── Users (with Credentials-compatible password hashing) ─────────────────
  console.log("👤 Seeding users…");
  for (const u of SEED_USERS) {
    const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, password: hashedPassword },
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
      },
    });
    console.log(`  ✓ ${u.role.padEnd(6)} — ${u.email}  (pw: ${u.password})`);
  }

  // ─── Room Types ────────────────────────────────────────────────────────────
  console.log("\n🏕️  Seeding room types…");
  const createdTypes: Record<string, string> = {};
  for (const rt of ROOM_TYPES) {
    const roomType = await prisma.roomType.upsert({
      where: { id: rt.name.toLowerCase().replace(/\s+/g, "_") },
      update: { pricePerNight: rt.pricePerNight },
      create: {
        id: rt.name.toLowerCase().replace(/\s+/g, "_"),
        name: rt.name,
        description: rt.description,
        maxCapacity: rt.maxCapacity,
        pricePerNight: rt.pricePerNight,
      },
    });
    createdTypes[rt.name] = roomType.id;
    console.log(`  ✓ ${rt.name} — $${rt.pricePerNight}/night`);
  }

  // ─── Rooms ─────────────────────────────────────────────────────────────────
  console.log("\n🛏️  Seeding rooms…");
  for (const [typeName, numbers] of Object.entries(ROOMS_BY_TYPE)) {
    for (const num of numbers) {
      await prisma.room.upsert({
        where: { number: num },
        update: {},
        create: {
          number: num,
          roomTypeId: createdTypes[typeName],
          status: "AVAILABLE",
        },
      });
      process.stdout.write(`  ✓ Room ${num} `);
    }
    console.log();
  }

  // ─── Add-on Services ───────────────────────────────────────────────────────
  console.log("\n🎯 Seeding add-on services…");
  for (const addon of ADD_ONS) {
    const id = addon.name.toLowerCase().replace(/\s+/g, "_").replace(/[()]/g, "");
    await prisma.extraService.upsert({
      where: { id },
      update: { basePrice: addon.price, isActive: addon.active },
      create: {
        id,
        name: addon.name,
        description: addon.description,
        basePrice: addon.price,
        category: addon.category,
        pricingModel: "FLAT_RATE",
        isActive: addon.active,
      },
    });
    console.log(`  ✓ ${addon.name} — $${addon.price}`);
  }

  // ─── Safari Packages ───────────────────────────────────────────────────────
  console.log("\n🚙 Seeding Safari Packages…");
  const SAFARI_PACKAGES = [
    { name: "Morning Safari", type: "MORNING" as const, startTime: "05:30", endTime: "10:30", basePrice: 45, pricingType: "PER_PERSON" as const, minGuests: 1, maxCapacity: 6, inclusions: ["Jeep", "Tracker"], active: true },
    { name: "Afternoon Safari", type: "AFTERNOON" as const, startTime: "14:30", endTime: "18:30", basePrice: 45, pricingType: "PER_PERSON" as const, minGuests: 1, maxCapacity: 6, inclusions: ["Jeep", "Tracker"], active: true },
    { name: "Full Day Safari", type: "FULL_DAY" as const, startTime: "05:30", endTime: "18:30", basePrice: 90, pricingType: "PER_PERSON" as const, minGuests: 1, maxCapacity: 6, inclusions: ["Jeep", "Tracker", "Lunch"], active: true },
  ];
  for (const pkg of SAFARI_PACKAGES) {
    const id = pkg.name.toLowerCase().replace(/\s+/g, "_");
    await prisma.safariPackage.upsert({
      where: { id },
      update: { basePrice: pkg.basePrice, isActive: pkg.active },
      create: {
        id,
        name: pkg.name,
        type: pkg.type,
        startTime: pkg.startTime,
        endTime: pkg.endTime,
        basePrice: pkg.basePrice,
        pricingType: pkg.pricingType,
        minGuests: pkg.minGuests,
        maxCapacity: pkg.maxCapacity,
        inclusions: pkg.inclusions,
        isActive: pkg.active,
      }
    });
    console.log(`  ✓ ${pkg.name} — $${pkg.basePrice}`);
  }

  // ─── Entrance Tickets ──────────────────────────────────────────────────────
  console.log("\n🎫 Seeding Entrance Tickets…");
  const TICKETS = [
    { name: "Block 1 (Morning)", type: "MORNING" as const, adultPrice: 35, childPrice: 15, active: true },
    { name: "Block 1 (Afternoon)", type: "AFTERNOON" as const, adultPrice: 35, childPrice: 15, active: true },
    { name: "Block 1 (Full Day)", type: "FULL_DAY" as const, adultPrice: 50, childPrice: 25, active: true },
  ];
  for (const tkt of TICKETS) {
    await prisma.entranceTicket.create({
      data: {
        name: tkt.name,
        type: tkt.type,
        adultPrice: tkt.adultPrice,
        childPrice: tkt.childPrice,
        isActive: tkt.active,
      }
    });
    console.log(`  ✓ ${tkt.name} — Adult: $${tkt.adultPrice} / Child: $${tkt.childPrice}`);
  }

  console.log("\n✅ Seed complete!\n");
  console.log("─────────────────────────────────────────────");
  console.log("  ADMIN  → admin@yaladiary.com / Admin@2026!");
  console.log("  STAFF  → staff@yaladiary.com / Staff@2026!");
  console.log("  GUEST  → guest@yaladiary.com / Guest@2026!");
  console.log("─────────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
