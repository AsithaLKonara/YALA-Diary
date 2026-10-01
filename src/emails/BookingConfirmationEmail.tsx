import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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
      <Preview>Your Yala Diary Safari is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YALA DIARY</Heading>
          <Heading style={h2}>Payment Successful!</Heading>
          <Text style={text}>Hi {booking.guestName},</Text>
          <Text style={text}>
            Thank you for choosing Yala Diary. We have successfully received your payment and your safari reservation is now confirmed. We can't wait to host you!
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailsHeading}>Booking Reference: {booking.ref}</Text>
            <Hr style={hr} />
            <Text style={detailsText}><strong>Check-in / Safari Date:</strong> {checkInDate}</Text>
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
            If you have any questions or need to modify your booking, please contact us at info@theyaladiary.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#111111',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  border: '1px solid #333333',
  maxWidth: '600px',
};

const h1 = {
  color: '#9acd32',
  fontSize: '20px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
};

const h2 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 30px 0',
};

const text = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const detailsContainer = {
  backgroundColor: '#1a1a1a',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
  border: '1px solid #222222',
};

const detailsHeading = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const sectionHeading = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
};

const detailsText = {
  color: '#aaaaaa',
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
  borderColor: '#333333',
  margin: '15px 0',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '40px',
};
