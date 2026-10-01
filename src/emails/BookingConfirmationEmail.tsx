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
    bookingAttemptId?: string;
    createdAt?: Date;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guestCountry?: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    roomRevenue: number;
    addOnRevenue: number;
    totalRevenue: number;
    amountPaid: number;
    paymentStatus: string;
    currency: string;
    adults: number;
    children: number;
    safariBookings?: any[];
    serviceBookings?: any[];
  };
}

export const BookingConfirmationEmail = ({
  booking,
}: BookingConfirmationEmailProps) => {
  const checkInDate = new Date(booking.checkIn).toLocaleString();
  const checkOutDate = new Date(booking.checkOut).toLocaleString();
  const bookingDate = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A';
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
            <Text style={detailsHeading}>Booking Overview</Text>
            <Hr style={hr} />
            <Text style={detailsText}><strong>Booking Reference:</strong> {booking.ref}</Text>
            <Text style={detailsText}><strong>Payment Reference ID:</strong> {booking.bookingAttemptId || 'N/A'}</Text>
            <Text style={detailsText}><strong>Booking Date/Time:</strong> {bookingDate}</Text>
            <Text style={detailsText}><strong>Check-in:</strong> {checkInDate}</Text>
            <Text style={detailsText}><strong>Check-out:</strong> {checkOutDate}</Text>
            <Text style={detailsText}><strong>Duration:</strong> {booking.nights || 1} Nights</Text>
            
            <Text style={sectionHeading}>Guest Details</Text>
            <Text style={detailsText}><strong>Name:</strong> {booking.guestName}</Text>
            <Text style={detailsText}><strong>Email:</strong> {booking.guestEmail}</Text>
            <Text style={detailsText}><strong>Phone:</strong> {booking.guestPhone || 'N/A'}</Text>
            <Text style={detailsText}><strong>Country:</strong> {booking.guestCountry || 'N/A'}</Text>
            <Text style={detailsText}><strong>Guests:</strong> {totalGuests} ({booking.adults} Adults, {booking.children} Children)</Text>
            
            {booking.safariBookings && booking.safariBookings.length > 0 && (
              <>
                <Text style={sectionHeading}>Safari Itinerary</Text>
                {booking.safariBookings.map((sb: any) => (
                  <Text key={sb.id} style={detailsText}>
                    • {sb.package?.name || 'Safari Package'} on {new Date(sb.date).toLocaleString()}
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
            <Text style={sectionHeading}>Payment Summary</Text>
            <Text style={detailsText}><strong>Base Revenue (Room/Safari):</strong> {booking.currency || 'USD'} {Number(booking.roomRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={detailsText}><strong>Add-ons & Extras:</strong> {booking.currency || 'USD'} {Number(booking.addOnRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={detailsText}><strong>Payment Status:</strong> {booking.paymentStatus}</Text>
            <Text style={totalText}>Total Paid: {booking.currency || 'USD'} {Number(booking.amountPaid || booking.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
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
