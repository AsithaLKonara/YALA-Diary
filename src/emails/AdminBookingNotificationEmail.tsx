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
  Link,
} from '@react-email/components';

interface AdminBookingNotificationProps {
  booking: {
    id: string;
    ref: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guestCountry?: string;
    specialRequests?: string;
    checkIn: Date;
    totalRevenue: number;
    adults: number;
    children: number;
  };
}

export const AdminBookingNotificationEmail = ({
  booking,
}: AdminBookingNotificationProps) => {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString();
  const totalGuests = booking.adults + booking.children;
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://theyaladiary.com'}/admin/bookings/${booking.id}`;

  return (
    <Html>
      <Head />
      <Preview>NEW BOOKING: {booking.guestName} - {booking.ref}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Booking Alert</Heading>
          
          <Section style={highlightSection}>
            <Text style={highlightText}>
              <strong>{booking.guestName}</strong> just completed a booking for <strong>${booking.totalRevenue.toFixed(2)}</strong>.
            </Text>
          </Section>

          <Section style={detailsContainer}>
            <Text style={sectionHeading}>Booking Specs</Text>
            <Text style={detailsText}><strong>Reference:</strong> {booking.ref}</Text>
            <Text style={detailsText}><strong>Date:</strong> {checkInDate}</Text>
            <Text style={detailsText}><strong>Guests:</strong> {totalGuests} ({booking.adults} A, {booking.children} C)</Text>
            
            <Hr style={hr} />

            <Text style={sectionHeading}>Guest Info</Text>
            <Text style={detailsText}><strong>Name:</strong> {booking.guestName}</Text>
            <Text style={detailsText}><strong>Email:</strong> {booking.guestEmail}</Text>
            <Text style={detailsText}><strong>Phone:</strong> {booking.guestPhone || 'N/A'}</Text>
            <Text style={detailsText}><strong>Country:</strong> {booking.guestCountry || 'N/A'}</Text>
            <Text style={detailsText}><strong>Special Requests:</strong> {booking.specialRequests || 'None'}</Text>
          </Section>

          <Section style={actionContainer}>
            <Link href={adminUrl} style={button}>
              View in Admin Panel
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminBookingNotificationEmail;

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  maxWidth: '600px',
  overflow: 'hidden',
};

const h1 = {
  color: '#9acd32',
  backgroundColor: '#222222',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
  padding: '20px',
};

const highlightSection = {
  backgroundColor: '#e8f5e9',
  borderLeft: '4px solid #4caf50',
  padding: '15px',
  margin: '20px',
  borderRadius: '4px',
};

const highlightText = {
  margin: '0',
  color: '#2e7d32',
  fontSize: '16px',
};

const detailsContainer = {
  padding: '0 20px',
  margin: '20px 0',
};

const sectionHeading = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
  borderBottom: '1px solid #eee',
  paddingBottom: '5px',
};

const detailsText = {
  color: '#555555',
  fontSize: '14px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#eeeeee',
  margin: '20px 0',
};

const actionContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
  padding: '0 20px 30px',
};

const button = {
  backgroundColor: '#222222',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  fontWeight: 'bold',
  display: 'inline-block',
};
