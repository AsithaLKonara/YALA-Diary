import { Resend } from 'resend';
import { BookingConfirmationEmail } from '@/emails/BookingConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY || 're_test_mock');

export async function sendBookingConfirmationEmail(booking: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Yala Diary <reservations@yaladiary.com>', // Replace with verified domain in production
      to: booking.guestEmail,
      subject: `Booking Confirmation - ${booking.ref}`,
      react: BookingConfirmationEmail({ booking }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
