import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CalendarDays, Wallet, Clock, MapPin } from "lucide-react";
import styles from "./page.module.css";
import { format } from "date-fns";

export default async function GuestDashboard() {
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
      roomType: true,
      hotelRef: true,
      safariBookings: {
        include: { slot: true }
      }
    },
    orderBy: {
      checkIn: "asc"
    }
  });

  const now = new Date();
  
  // Categorize bookings
  const upcomingBookings = bookings.filter(b => new Date(b.checkOut) > now && b.status !== "CANCELLED");
  const pastBookings = bookings.filter(b => new Date(b.checkOut) <= now && b.status !== "CANCELLED");
  const nextBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  // Calculate metrics
  const totalSpent = pastBookings.reduce((sum, b) => {
    if (b.paymentStatus === "PAID") return sum + b.totalRevenue;
    return sum;
  }, 0);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "CHECKED_IN":
      case "CHECKED_OUT":
        return <span className={`${styles.badge} ${styles.badgeSuccess}`}>{status}</span>;
      case "DRAFT":
      case "PENDING_PAYMENT":
      case "CREATING_RESERVATION":
        return <span className={`${styles.badge} ${styles.badgeWarning}`}>{status}</span>;
      case "CANCELLED":
      case "FAILED":
        return <span className={`${styles.badge} ${styles.badgeDanger}`}>{status}</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeInfo}`}>{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className={`${styles.badge} ${styles.badgeSuccess}`}>{status}</span>;
      case "UNPAID":
        return <span className={`${styles.badge} ${styles.badgeDanger}`}>{status}</span>;
      case "PARTIAL":
        return <span className={`${styles.badge} ${styles.badgeWarning}`}>{status}</span>;
      case "REFUNDED":
        return <span className={`${styles.badge} ${styles.badgeInfo}`}>{status}</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };

  return (
    <div className="admin-content">
      <header className={styles.dashboardHeader}>
        <div className={styles.greeting}>
          <h1>Welcome back, {session.user.name || "Guest"}</h1>
          <p>Here is your travel itinerary and account overview.</p>
        </div>
      </header>

      {/* Metrics Section */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><CalendarDays size={24} /></div>
          <div className={styles.metricInfo}>
            <h3>Upcoming Stays</h3>
            <div className={styles.value}>{upcomingBookings.length}</div>
          </div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Wallet size={24} /></div>
          <div className={styles.metricInfo}>
            <h3>Total Spent (Past)</h3>
            <div className={styles.value}>{formatCurrency(totalSpent)}</div>
          </div>
        </div>
      </div>

      {/* Up Next Section */}
      {nextBooking && (
        <section className={styles.upNextSection}>
          <h2 className={styles.sectionTitle}>Up Next</h2>
          <div className={styles.heroCard}>
            <div className={styles.heroContent}>
              <h2>{nextBooking.hotelRef?.name || nextBooking.hotel}</h2>
              <p><MapPin size={16} /> {nextBooking.hotelRef?.address || "Yala National Park Area"}</p>
              
              <div className={styles.heroDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Check-in</span>
                  <span className={styles.detailValue}>{format(new Date(nextBooking.checkIn), "MMM dd, yyyy")}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Check-out</span>
                  <span className={styles.detailValue}>{format(new Date(nextBooking.checkOut), "MMM dd, yyyy")}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Room</span>
                  <span className={styles.detailValue}>{nextBooking.roomType.name}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.heroAction}>
              {/* Optional: Add a "View Itinerary" or "Manage" button here in the future */}
            </div>
          </div>
        </section>
      )}

      {/* Bookings List Section */}
      <section className={styles.recentBookingsSection}>
        <h2 className={styles.sectionTitle}>All Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
            <p>You have no bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Property</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>{booking.ref}</strong></td>
                    <td>{booking.hotelRef?.name || booking.hotel}</td>
                    <td>
                      {format(new Date(booking.checkIn), "MMM dd, yyyy")} - {format(new Date(booking.checkOut), "MMM dd")}
                    </td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>{getPaymentBadge(booking.paymentStatus)}</td>
                    <td>{formatCurrency(booking.totalRevenue, booking.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
