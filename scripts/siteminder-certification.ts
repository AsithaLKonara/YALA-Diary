import { SiteMinderClient } from '../src/modules/connectivity/providers/siteminder/client';
import fs from 'fs';
import path from 'path';

async function runCertification() {
  const logs: any[] = [];
  const client = new SiteMinderClient();

  console.log("Starting SiteMinder Certification Execution...");

  // 1. Search (Availability)
  console.log("-> Fetching Availability");
  const availabilityReq = {
    hotelId: "YALA-TEST-01",
    checkIn: "2026-10-01",
    checkOut: "2026-10-05",
    adults: 2,
    children: 0
  };
  const availabilityRes = await client.getAvailability(availabilityReq);
  logs.push({ step: "Availability", request: availabilityReq, response: availabilityRes });

  // 2. Book (Create Reservation)
  console.log("-> Creating Reservation");
  const createReq = {
    hotelId: "YALA-TEST-01",
    roomTypeId: "RT-01",
    ratePlanId: "RP-01",
    checkIn: "2026-10-01",
    checkOut: "2026-10-05",
    guest: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      country: "US"
    },
    price: { amount: 500, currency: "USD" }
  };
  const createRes = await client.createReservation(createReq);
  logs.push({ step: "Create Reservation", request: createReq, response: createRes });

  // 3. Modify Reservation
  console.log("-> Modifying Reservation");
  const modifyReq = {
    reservationId: createRes.id,
    checkOut: "2026-10-06"
  };
  const modifyRes = await client.modifyReservation(modifyReq);
  logs.push({ step: "Modify Reservation", request: modifyReq, response: modifyRes });

  // 4. Cancel Reservation
  console.log("-> Canceling Reservation");
  const cancelReq = {
    reservationId: createRes.id,
    reason: "Guest requested cancellation"
  };
  let cancelRes;
  try {
    await client.cancelReservation(cancelReq);
    cancelRes = { status: "CANCELLED" };
  } catch (error: any) {
    cancelRes = { status: "ERROR", message: error.message };
  }
  logs.push({ step: "Cancel Reservation", request: cancelReq, response: cancelRes });

  // Output logs
  const logPath = path.join(process.cwd(), 'siteminder-certification-logs.json');
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  console.log(`Certification complete. Logs saved to ${logPath}`);
}

runCertification().catch(console.error);
