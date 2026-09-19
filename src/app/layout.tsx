import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YALA DIARY",
  description: "Yala Diary - Your Safari Adventure",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="header-container">
            <div className="header-logo-group">
              <Image src="/logo.png" alt="Yala Diary Logo" width={48} height={48} priority className="header-logo" />
              <h1 className="header-title">YALA DIARY</h1>
            </div>
            
            <nav className="main-nav">
              <a href="#" className="nav-link">Home</a>
              <a href="#" className="nav-link">Explore</a>
              <a href="#" className="nav-link">Safaris</a>
              <a href="#" className="nav-link">About</a>
            </nav>
            
            <button className="book-btn">Book Now</button>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
