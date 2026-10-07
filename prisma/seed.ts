// prisma/seed.ts — Production seed script
// Creates admin account for production

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

const SEED_USERS = [
  {
    name: "Yala Admin",
    email: "admin@yaladiary.com",
    password: "Admin@2026!",
    role: "ADMIN" as const,
  },
];

async function main() {
  console.log("🌿 Seeding Yala Diary production database…\n");

  // ─── Users (with Credentials-compatible password hashing) ─────────────────
  console.log("👤 Seeding admin user…");
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

  console.log("\n✅ Seed complete!\n");
  console.log("─────────────────────────────────────────────");
  console.log("  ADMIN  → admin@yaladiary.com / Admin@2026!");
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
