import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingConfirmationEmailProps {
  booking: {
    ref: string;
    guestName: string;
    checkIn: Date;
    checkOut: Date;
    totalRevenue: number;
    adults: number;
    children: number;
    safariBookings?: any[];
    serviceBookings?: any[];
  };
}

export const BookingConfirmationEmail = ({
  booking,
}: BookingConfirmationEmailProps) => {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString();
  const totalGuests = booking.adults + booking.children;

  return (
    <Html>
      <Head />
      <Preview>Your booking with Yala Diary is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmed</Heading>
          <Text style={text}>Hi {booking.guestName},</Text>
          <Text style={text}>
            Thank you for booking with Yala Diary. Your reservation has been confirmed. Below are your booking details.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailsHeading}>Booking Reference: {booking.ref}</Text>
            <Hr style={hr} />
            <Text style={detailsText}><strong>Check-in:</strong> {checkInDate}</Text>
            <Text style={detailsText}><strong>Check-out:</strong> {checkOutDate}</Text>
            <Text style={detailsText}><strong>Guests:</strong> {totalGuests} ({booking.adults} Adults, {booking.children} Children)</Text>
            
            {booking.safariBookings && booking.safariBookings.length > 0 && (
              <>
                <Text style={sectionHeading}>Safari Itinerary</Text>
                {booking.safariBookings.map((sb: any) => (
                  <Text key={sb.id} style={detailsText}>
                    • {sb.package?.name || 'Safari Package'} on {new Date(sb.date).toLocaleDateString()}
                  </Text>
                ))}
              </>
            )}

            {booking.serviceBookings && booking.serviceBookings.length > 0 && (
              <>
                <Text style={sectionHeading}>Extra Services</Text>
                {booking.serviceBookings.map((sb: any) => (
                  <Text key={sb.id} style={detailsText}>
                    • {sb.service?.name || 'Add-on'} (Qty: {sb.quantity})
                  </Text>
                ))}
              </>
            )}

            <Hr style={hr} />
            <Text style={totalText}>Total Paid: ${booking.totalRevenue.toFixed(2)}</Text>
          </Section>

          <Text style={footer}>
            If you have any questions or need to modify your booking, please contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  border: '1px solid #e6ebf1',
  maxWidth: '600px',
};

const h1 = {
  color: '#9acd32',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const detailsContainer = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
};

const detailsHeading = {
  color: '#334155',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const sectionHeading = {
  color: '#334155',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
};

const detailsText = {
  color: '#475569',
  fontSize: '14px',
  margin: '5px 0',
};

const totalText = {
  color: '#9acd32',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  margin: '15px 0 0 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '15px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '40px',
};
