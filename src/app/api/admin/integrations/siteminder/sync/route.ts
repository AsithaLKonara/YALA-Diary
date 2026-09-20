import { NextResponse } from "next/server";
import { SiteMinderClient } from "@/modules/connectivity/providers/siteminder/client";
import { mapPropertyToDomain } from "@/modules/connectivity/providers/siteminder/mapper";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new SiteMinderClient();
    const rawProperties = await client.getProperties();

    let syncedCount = 0;

    for (const rawProp of rawProperties) {
      const mapped = mapPropertyToDomain(rawProp);

      // Upsert HotelProviderConnection
      const connection = await prisma.hotelProviderConnection.upsert({
        where: { id: `siteminder_${mapped.externalId}` },
        update: { lastSyncAt: new Date(), status: "ACTIVE" },
        create: {
          id: `siteminder_${mapped.externalId}`,
          provider: "SITEMINDER",
          externalPropertyId: mapped.externalId,
          status: "ACTIVE",
          lastSyncAt: new Date()
        }
      });

      // Upsert Hotel
      // Note: We don't overwrite Yala-specific fields (category, active) if the hotel already exists.
      const existingHotel = await prisma.hotel.findFirst({
        where: { externalId: mapped.externalId }
      });

      const hotel = await prisma.hotel.upsert({
        where: { id: existingHotel?.id || "new" },
        update: {
          name: mapped.name,
          address: mapped.address,
          facilities: mapped.facilities,
          providerConnectionId: connection.id
        },
        create: {
          externalId: mapped.externalId,
          name: mapped.name,
          description: mapped.description,
          address: mapped.address,
          facilities: mapped.facilities,
          images: mapped.images,
          active: false,
          providerConnectionId: connection.id
        }
      });

      // Sync Room Types
      for (const rt of mapped.roomTypes) {
        const existingRt = await prisma.roomType.findFirst({
          where: { hotelId: hotel.id, externalId: rt.externalId }
        });

        const roomType = await prisma.roomType.upsert({
          where: { id: existingRt?.id || "new" },
          update: {
            name: rt.name,
            description: rt.description,
            maxCapacity: rt.maxCapacity,
            pricePerNight: rt.pricePerNight
          },
          create: {
            hotelId: hotel.id,
            externalId: rt.externalId,
            name: rt.name,
            description: rt.description,
            maxCapacity: rt.maxCapacity,
            pricePerNight: rt.pricePerNight
          }
        });

        // Sync Rate Plans for this Room Type
        const ratePlansForRoom = mapped.ratePlans.filter((rp: any) => rp.roomTypeExternalId === rt.externalId);
        for (const rp of ratePlansForRoom) {
          const existingRp = await prisma.ratePlan.findFirst({
            where: { hotelId: hotel.id, externalId: rp.externalId }
          });

          await prisma.ratePlan.upsert({
            where: { id: existingRp?.id || "new" },
            update: {
              name: rp.name,
              mealPlan: rp.mealPlan,
              cancellationPolicy: rp.cancellationPolicy
            },
            create: {
              hotelId: hotel.id,
              roomTypeId: roomType.id,
              externalId: rp.externalId,
              name: rp.name,
              mealPlan: rp.mealPlan,
              cancellationPolicy: rp.cancellationPolicy
            }
          });
        }
      }
      syncedCount++;
    }

    return NextResponse.json({ success: true, syncedCount }, { status: 200 });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync" }, { status: 500 });
  }
}
