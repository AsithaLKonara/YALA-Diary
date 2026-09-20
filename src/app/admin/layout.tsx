import React from "react";
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/Sidebar";
import "@/app/admin/admin.css";

export const metadata: Metadata = {
  title: "Admin — Yala Diary",
  description: "Yala Diary admin dashboard",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
