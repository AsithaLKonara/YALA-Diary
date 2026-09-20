import React from "react";
import Image from "next/image";
import BookingWizard from "./BookingWizard";
import "./booking.css";

export const metadata = {
  title: "Book Safari - Yala Diary",
  description: "Reserve your luxury safari experience in Yala National Park.",
};

export default function BookPage() {
  return (
    <div className="booking-page">
      <div className="booking-header-bg">
        <Image 
          src="/images/assets/hero/pexels-sargaraj-tr-423973759-19669427.jpg" 
          alt="Booking Background" 
          fill 
          sizes="100vw"
        />
      </div>
      
      <div className="booking-container">
        <BookingWizard />
      </div>
    </div>
  );
}
