import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, Download, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function GuestBillingPage() {
  const session = await auth();
  
  if (!session || !session.user?.email) {
    redirect("/auth");
  }

  // Fetch bookings for this guest
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { guestEmail: session.user.email },
        { userId: session.user.id }
      ]
    },
    include: {
      hotelRef: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const totalSpent = bookings.reduce((sum, b) => {
    if (b.paymentStatus === "PAID") return sum + b.totalRevenue;
    return sum;
  }, 0);

  const outstandingBalance = bookings.reduce((sum, b) => {
    if (b.paymentStatus === "UNPAID" && b.status !== "CANCELLED" && b.status !== "FAILED") return sum + b.totalRevenue;
    return sum;
  }, 0);

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle2 size={16} className="text-green-500" style={{ color: "var(--dash-success)" }} />;
      case "UNPAID":
        return <Clock size={16} className="text-red-500" style={{ color: "var(--dash-danger)" }} />;
      case "PARTIAL":
        return <Clock size={16} className="text-yellow-500" style={{ color: "var(--dash-warn)" }} />;
      default:
        return <CheckCircle2 size={16} style={{ color: "var(--dash-muted)" }} />;
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1>Billing & Payments</h1>
          <p>Review your transaction history and outstanding balances.</p>
        </div>
      </div>

      <div className="dash-grid-2" style={{ gridTemplateColumns: "repeat(2, 1fr)", marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Spent</span>
            <div className="stat-card-icon" style={{ background: "rgba(76,175,114,0.12)", color: "var(--dash-success)" }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="stat-card-value">{formatCurrency(totalSpent)}</div>
          <div className="stat-card-sub">Across all completed payments</div>
        </div>

        <div className="stat-card" style={{ border: outstandingBalance > 0 ? "1px solid var(--dash-danger)" : "" }}>
          <div className="stat-card-header">
            <span className="stat-card-label" style={{ color: outstandingBalance > 0 ? "var(--dash-danger)" : "" }}>Outstanding Balance</span>
            <div className="stat-card-icon" style={{ background: outstandingBalance > 0 ? "rgba(224,82,82,0.12)" : "var(--dash-surface-2)", color: outstandingBalance > 0 ? "var(--dash-danger)" : "var(--dash-muted)" }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: outstandingBalance > 0 ? "var(--dash-danger)" : "var(--dash-text)" }}>
            {formatCurrency(outstandingBalance)}
          </div>
          <div className="stat-card-sub">Amount due for upcoming stays</div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-toolbar">
          <h3 style={{ fontSize: "1rem", fontWeight: 500, margin: 0 }}>Transaction History</h3>
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--dash-muted)" }}>
            <CreditCard size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date Issued</th>
                  <th>Booking Ref</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--dash-text)" }}>
                        {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="muted">{format(new Date(booking.createdAt), "h:mm a")}</div>
                    </td>
                    <td>
                      <span className="ref-link">{booking.ref}</span>
                    </td>
                    <td>
                      <div style={{ color: "var(--dash-text)", fontSize: "0.85rem" }}>
                        Accommodation at {booking.hotelRef?.name || booking.hotel}
                      </div>
                      <div className="muted" style={{ fontSize: "0.75rem", marginTop: 2 }}>
                        {booking.nights} nights ({booking.adults} Adults)
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {getPaymentStatusIcon(booking.paymentStatus)}
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: booking.paymentStatus === "UNPAID" ? "var(--dash-danger)" : booking.paymentStatus === "PAID" ? "var(--dash-success)" : "var(--dash-muted)" }}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {formatCurrency(booking.totalRevenue, booking.currency)}
                    </td>
                    <td>
                      <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: "0.75rem" }} disabled={booking.paymentStatus !== "PAID"}>
                        <Download size={14} style={{ marginRight: 6 }} />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
