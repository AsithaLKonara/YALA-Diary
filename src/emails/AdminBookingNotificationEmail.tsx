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
import { getBaseUrl } from '@/lib/seo/config';

interface AdminBookingNotificationProps {
  booking: {
    id: string;
    ref: string;
    bookingAttemptId?: string;
    createdAt?: Date;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guestCountry?: string;
    specialRequests?: string;
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

export const AdminBookingNotificationEmail = ({
  booking,
}: AdminBookingNotificationProps) => {
  const checkInDate = new Date(booking.checkIn).toLocaleString();
  const checkOutDate = booking.checkOut ? new Date(booking.checkOut).toLocaleString() : 'N/A';
  const bookingDate = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A';
  const totalGuests = booking.adults + booking.children;
  const adminUrl = `${getBaseUrl()}/admin/bookings/${booking.id}`;

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
            <Text style={sectionHeading}>Booking Overview</Text>
            <Text style={detailsText}><strong>Reference:</strong> {booking.ref}</Text>
            <Text style={detailsText}><strong>Payment Reference ID:</strong> {booking.bookingAttemptId || 'N/A'}</Text>
            <Text style={detailsText}><strong>Booking Date/Time:</strong> {bookingDate}</Text>
            <Text style={detailsText}><strong>Check-in:</strong> {checkInDate}</Text>
            <Text style={detailsText}><strong>Check-out:</strong> {checkOutDate}</Text>
            <Text style={detailsText}><strong>Duration:</strong> {booking.nights || 1} Nights</Text>
            <Text style={detailsText}><strong>Guests:</strong> {totalGuests} ({booking.adults} A, {booking.children} C)</Text>
            
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
            <Text style={detailsText}><strong>Total Paid:</strong> {booking.currency || 'USD'} {Number(booking.amountPaid || booking.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>

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
