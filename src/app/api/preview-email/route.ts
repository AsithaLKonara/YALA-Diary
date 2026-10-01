import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { BookingConfirmationEmail } from "@/emails/BookingConfirmationEmail";
import { AdminBookingNotificationEmail } from "@/emails/AdminBookingNotificationEmail";
import React from "react";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "guest"; // 'guest' or 'admin'

  // Mock booking data for preview
  const mockBooking = {
    id: "test-preview-123",
    ref: "YD-TEST9999",
    guestName: "Asitha Konara",
    guestEmail: "asithalakmalkonara11992081@gmail.com",
    guestPhone: "+94 77 123 4567",
    guestCountry: "Sri Lanka",
    specialRequests: "Looking forward to the morning safari!",
    checkIn: new Date(Date.now() + 86400000 * 2), // 2 days from now
    checkOut: new Date(Date.now() + 86400000 * 3),
    totalRevenue: 340.50,
    adults: 2,
    children: 1,
    safariBookings: [
      {
        id: "safari-1",
        date: new Date(Date.now() + 86400000 * 2),
        package: { name: "Morning Leopard Safari (Block 1)" }
      }
    ],
    serviceBookings: [
      {
        id: "service-1",
        quantity: 1,
        service: { name: "Binoculars Rental" }
      }
    ]
  };

  try {
    let html;
    if (type === "admin") {
      html = await render(React.createElement(AdminBookingNotificationEmail, { booking: mockBooking }));
    } else {
      html = await render(React.createElement(BookingConfirmationEmail, { booking: mockBooking }));
    }

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Failed to render email preview:", error);
    return NextResponse.json({ error: "Failed to render preview" }, { status: 500 });
  }
}
