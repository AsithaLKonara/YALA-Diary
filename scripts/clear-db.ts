import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function clearDB() {
  console.log("Starting database cleanup...");
  
  // 1. Delete all transactional / booking data
  console.log("Deleting bookings...");
  await prisma.safariBooking.deleteMany();
  await prisma.serviceBooking.deleteMany();
  await prisma.bookingEvent.deleteMany();
  await prisma.booking.deleteMany();

  // 2. Delete property data
  console.log("Deleting rooms and hotels...");
  await prisma.room.deleteMany();
  await prisma.ratePlan.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.hotelProviderConnection.deleteMany();
  await prisma.hotel.deleteMany();

  // 3. Delete packages and services
  console.log("Deleting packages and services...");
  await prisma.entranceTicket.deleteMany();
  await prisma.extraService.deleteMany();
  await prisma.safariPackage.deleteMany();

  // 4. Delete configuration & notifications
  console.log("Deleting settings & notifications...");
  await prisma.notification.deleteMany();
  await prisma.hotelProfile.deleteMany();
  await prisma.verificationToken.deleteMany();

  // 5. Delete all sessions and accounts just to be safe
  console.log("Deleting sessions and accounts...");
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();

  // 6. Delete all users except ADMIN
  console.log("Deleting non-admin users...");
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: {
        not: "ADMIN",
      }
    }
  });
  console.log(`Deleted ${deletedUsers.count} non-admin users.`);

  console.log("✅ Database cleared successfully! Only admin credentials remain.");
}

clearDB()
  .catch((e) => {
    console.error("Error during database cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
