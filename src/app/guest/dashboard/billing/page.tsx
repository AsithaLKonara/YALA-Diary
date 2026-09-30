import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, Download, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function GuestBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  
  if (!session || !session.user?.email) {
    redirect("/auth");
  }

  const whereClause = {
    OR: [
      { guestEmail: session.user.email },
      { userId: session.user.id }
    ]
  };

  // Fetch ALL bookings to calculate metrics
  const allBookings = await prisma.booking.findMany({
    where: whereClause,
    select: { paymentStatus: true, status: true, totalRevenue: true, amountPaid: true }
  });

  const page = parseInt(params.page || "1", 10);
  const take = 10;
  const skip = (page - 1) * take;
  const totalBookings = await prisma.booking.count({ where: whereClause });

  // Fetch paginated bookings for the table
  const bookings = await prisma.booking.findMany({
    where: whereClause,
    take,
    skip,
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

  const totalSpent = allBookings.reduce((sum, b) => {
    return sum + (b.amountPaid || 0);
  }, 0);

  const outstandingBalance = allBookings.reduce((sum, b) => {
    if (b.status !== "CANCELLED" && b.status !== "FAILED") {
      return sum + Math.max(0, b.totalRevenue - (b.amountPaid || 0));
    }
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

        {totalBookings > take && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "0 16px" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--dash-muted)" }}>
              Showing {skip + 1} to {Math.min(skip + take, totalBookings)} of {totalBookings}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {page > 1 ? (
                <Link href={`/guest/dashboard/billing?page=${page - 1}`} className="btn-secondary" style={{ padding: "8px 16px" }}>
                  Previous
                </Link>
              ) : (
                <button className="btn-secondary" disabled style={{ padding: "8px 16px", opacity: 0.5 }}>Previous</button>
              )}
              {skip + take < totalBookings ? (
                <Link href={`/guest/dashboard/billing?page=${page + 1}`} className="btn-secondary" style={{ padding: "8px 16px" }}>
                  Next
                </Link>
              ) : (
                <button className="btn-secondary" disabled style={{ padding: "8px 16px", opacity: 0.5 }}>Next</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
