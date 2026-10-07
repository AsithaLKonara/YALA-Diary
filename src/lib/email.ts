import { Resend } from 'resend';
import { BookingConfirmationEmail } from '@/emails/BookingConfirmationEmail';
import { AdminBookingNotificationEmail } from '@/emails/AdminBookingNotificationEmail';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables.');
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(booking: any) {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL as string;
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: booking.guestEmail,
      subject: `Booking Confirmed: Your Safari at Yala Diary (Ref: ${booking.ref})`,
      react: BookingConfirmationEmail({ booking }),
    });

    if (error) {
      console.error('Failed to send guest email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export async function sendAdminNotificationEmail(booking: any) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL as string;
    const fromEmail = process.env.RESEND_FROM_EMAIL as string;
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `NEW BOOKING: [${booking.ref}] - ${booking.guestName}`,
      react: AdminBookingNotificationEmail({ booking }),
    });

    if (error) {
      console.error('Failed to send admin email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
