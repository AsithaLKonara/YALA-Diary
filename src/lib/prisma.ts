// src/lib/prisma.ts — Singleton Prisma Client
import { PrismaClient } from "@/generated/prisma/client";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function getConnectionString(): string {
  let url = `${process.env.DATABASE_URL || ""}`;
  if (url.includes("sslmode=require")) {
    url = url.replace("sslmode=require", "sslmode=verify-full");
  }
  return url;
}

const connectionString = getConnectionString();

const globalForPrisma = globalThis as unknown as {
  prisma4: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const pool = globalForPrisma.pgPool ?? new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma4 ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma4 = prisma;
  globalForPrisma.pgPool = pool;
}
