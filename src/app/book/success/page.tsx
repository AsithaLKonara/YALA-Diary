import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="booking-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(154, 205, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={40} color="var(--primary)" />
        </div>
        <h2 className="booking-title" style={{ fontSize: '2.5rem', marginBottom: 15 }}>Payment Successful!</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: 500, margin: '0 auto 30px' }}>
          Thank you for choosing Yala Diary. We have received your payment and your reservation is confirmed. We have sent a confirmation email to your inbox.
        </p>

        {searchParams.session_id && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 40 }}>
            Session ID: {searchParams.session_id}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          <Link href="/" className="btn-secondary">
            Return to Home
          </Link>
          <Link href="/guest/dashboard/bookings" className="btn-primary">
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
