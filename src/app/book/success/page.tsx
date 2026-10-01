import React from 'react';
import Link from 'next/link';
import { Check, XCircle } from 'lucide-react';
import { stripe } from '@/lib/stripe';

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  let isSuccess = false;
  let errorMsg = null;
  let sessionId = null;

  const resolvedSearchParams = await searchParams;
  sessionId = resolvedSearchParams.session_id;

  try {

    if (sessionId) {
      if (sessionId.startsWith('mock_session_')) {
        isSuccess = true;
      } else {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
          isSuccess = true;
          // In production, the database fulfillment, SiteMinder sync, 
          // and email sending is entirely handled securely by the Stripe Webhook.
          // We only verify the status here for the UI.
        } else {
          errorMsg = "Payment was not completed.";
        }
      }
    } else {
      errorMsg = "No session ID provided.";
    }
  } catch (error) {
    console.error("Error verifying payment session:", error);
    errorMsg = "Failed to verify payment session.";
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="booking-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600 }}>
        {isSuccess ? (
          <>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(154, 205, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check size={40} color="var(--primary)" />
            </div>
            <h2 className="booking-title" style={{ fontSize: '2.5rem', marginBottom: 15 }}>Payment Successful!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: 500, margin: '0 auto 30px' }}>
              Thank you for choosing Yala Diary. We have received your payment and your reservation is confirmed. We have sent a confirmation email to your inbox.
            </p>
          </>
        ) : (
          <>
             <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <XCircle size={40} color="#ef4444" />
            </div>
            <h2 className="booking-title" style={{ fontSize: '2.5rem', marginBottom: 15 }}>Payment Incomplete</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: 500, margin: '0 auto 30px' }}>
              {errorMsg || "We couldn't confirm your payment. If you believe this is an error, please contact support."}
            </p>
          </>
        )}

        {sessionId && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 40 }}>
            Session ID: {sessionId}
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
