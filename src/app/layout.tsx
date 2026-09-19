import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import CursorGlow from "@/components/CursorGlow";
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
        <CursorGlow />
        <header className="site-header">
          <div className="header-container">
            <div className="header-logo-group">
              <Image src="/logo.png" alt="Yala Diary Logo" width={100} height={40} priority className="header-logo-img" />
            </div>
            
            <nav className="main-nav">
              <a href="#" className="nav-link">The Experience</a>
              <a href="#" className="nav-link">Wildlife</a>
              <a href="#" className="nav-link">Journal</a>
            </nav>
            
            <button className="nav-book-btn">Book Safari</button>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
