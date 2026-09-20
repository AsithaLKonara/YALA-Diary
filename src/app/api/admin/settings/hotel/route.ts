import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.hotelProfile.findMany({ take: 1 });
    let profile = profiles[0];

    // If it doesn't exist, provide a sensible default response but don't save it yet
    if (!profile) {
      profile = {
        id: "default",
        hotelName: "Mahoora by Eco Team Yala",
        address: "Yala National Park, Tissamaharama, Sri Lanka",
        phone: "+94 77 000 0000",
        email: "reservations@yaladiary.com",
        website: "https://yaladiary.com",
        checkInTime: "14:00",
        checkOutTime: "11:00",
        updatedAt: new Date()
      };
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Admin hotel profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Validate required fields roughly
    if (!data.hotelName || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since we only want one record, we'll try to find the first one and update it.
    // If it doesn't exist, we'll create it.
    const existing = await prisma.hotelProfile.findMany({ take: 1 });
    
    let profile;
    if (existing.length > 0) {
      profile = await prisma.hotelProfile.update({
        where: { id: existing[0].id },
        data: {
          hotelName: data.hotelName,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
        }
      });
    } else {
      profile = await prisma.hotelProfile.create({
        data: {
          hotelName: data.hotelName,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
        }
      });
    }

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    console.error("Admin hotel profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
