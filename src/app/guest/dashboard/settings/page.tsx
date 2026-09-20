import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import GuestSettingsForm from "./GuestSettingsForm";

export default async function GuestSettingsPage() {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    redirect("/auth");
  }

  // Fetch fresh user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, password: true }
  });

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1>Account Settings</h1>
          <p>Update your personal information and security preferences.</p>
        </div>
      </div>

      <div className="dash-card" style={{ maxWidth: 600 }}>
        <div className="dash-card-header">
          <h3 className="dash-card-title">Profile Information</h3>
        </div>
        <div className="dash-card-body">
          <GuestSettingsForm 
            initialName={user.name || ""} 
            initialEmail={user.email || ""} 
            hasPassword={!!user.password}
          />
        </div>
      </div>
    </div>
  );
}
