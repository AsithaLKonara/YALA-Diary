import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CalendarDays, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function GuestBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  
  if (!session || !session.user?.email) {
    redirect("/auth");
  }

  const page = parseInt(params.page || "1", 10);
  const take = 10;
  const skip = (page - 1) * take;

  const whereClause = {
    OR: [
      { guestEmail: session.user.email },
      { userId: session.user.id }
    ]
  };

  const totalBookings = await prisma.booking.count({ where: whereClause });

  // Fetch bookings for this guest
  const bookings = await prisma.booking.findMany({
    where: whereClause,
    take,
    skip,
    include: {
      roomType: true,
      hotelRef: true,
      safariBookings: {
        include: { package: true }
      }
    },
    orderBy: {
      checkIn: "desc"
    }
  });

  const getStatusBadge = (status: string) => {
    let className = "status-badge ";
    switch (status) {
      case "CONFIRMED":
      case "CHECKED_IN":
      case "CHECKED_OUT":
        className += "confirmed";
        break;
      case "DRAFT":
      case "PENDING_PAYMENT":
      case "CREATING_RESERVATION":
        className += "pending";
        break;
      case "CANCELLED":
      case "FAILED":
        className += "cancelled";
        break;
      default:
        className += "confirmed";
    }
    return <span className={className}>{status.replace(/_/g, " ")}</span>;
  };

  const getPaymentBadge = (status: string) => {
    let className = "status-badge ";
    switch (status) {
      case "PAID":
        className += "checked_in";
        break;
      case "UNPAID":
        className += "cancelled";
        break;
      case "PARTIAL":
        className += "pending";
        break;
      case "REFUNDED":
        className += "confirmed";
        break;
      default:
        className += "";
    }
    return <span className={className}>{status}</span>;
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1>My Bookings</h1>
          <p>Review and manage your complete reservation history.</p>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-toolbar">
          <div className="admin-filters">
            <div className="admin-topbar-search" style={{ border: "1px solid var(--dash-border)", background: "var(--dash-surface-2)" }}>
              <Search size={16} color="var(--dash-muted)" />
              <input type="text" placeholder="Search bookings..." />
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--dash-muted)" }}>
            <CalendarDays size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <p>You have no booking history.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref & Property</th>
                  <th>Dates</th>
                  <th>Room / Safaris</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--dash-text)" }}>{booking.ref}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--dash-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={10} />
                        {booking.hotelRef?.name || booking.hotel}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--dash-text)" }}>
                        {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                      </div>
                      <div className="muted">
                        to {format(new Date(booking.checkOut), "MMM dd, yyyy")} ({booking.nights} nights)
                      </div>
                    </td>
                    <td>
                      <div style={{ color: "var(--dash-text)", fontSize: "0.8rem", fontWeight: 500 }}>
                        {booking.roomType?.name}
                      </div>
                      <div className="muted">
                        {booking.adults} Adults, {booking.children} Children
                      </div>
                      {booking.safariBookings && booking.safariBookings.length > 0 && (
                        <div style={{ fontSize: "0.7rem", color: "var(--dash-accent)", marginTop: 4 }}>
                          + {booking.safariBookings.length} Safari Slot(s)
                        </div>
                      )}
                    </td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>{getPaymentBadge(booking.paymentStatus)}</td>
                    <td style={{ fontWeight: 600 }}>
                      {formatCurrency(booking.totalRevenue, booking.currency)}
                    </td>
                    <td>
                      <button className="row-action-btn">
                        View Details
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
                <Link href={`/guest/dashboard/bookings?page=${page - 1}`} className="btn-secondary" style={{ padding: "8px 16px" }}>
                  Previous
                </Link>
              ) : (
                <button className="btn-secondary" disabled style={{ padding: "8px 16px", opacity: 0.5 }}>Previous</button>
              )}
              {skip + take < totalBookings ? (
                <Link href={`/guest/dashboard/bookings?page=${page + 1}`} className="btn-secondary" style={{ padding: "8px 16px" }}>
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
