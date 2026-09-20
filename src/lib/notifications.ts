import { prisma } from "@/lib/prisma";
import { notificationEmitter } from "@/lib/emitter";

export async function createNotification(data: {
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  eventType: "notifyNewBooking" | "notifyCancellation" | "notifyCheckIn" | "notifyPayment";
}) {
  try {
    // 1. Check if this type of notification is enabled in HotelProfile
    const profiles = await prisma.hotelProfile.findMany({ take: 1 });
    const profile = profiles[0];

    // If no profile exists, or if the preference is explicitly false, do not create notification.
    // By default all preferences are true in schema.
    if (profile && profile[data.eventType] === false) {
      return null;
    }

    // 2. Create the notification record in the DB
    const notif = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || "INFO"
      }
    });

    // 3. Emit real-time event to SSE clients
    notificationEmitter.emit("new-notification", notif);

    return notif;
  } catch (err) {
    console.error("Failed to create notification:", err);
    return null;
  }
}
