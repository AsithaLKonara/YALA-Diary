import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    // We fetch the full user to verify password if necessary
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    
    // We allow email updates for GUEST roles, but must verify it's not taken
    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email is already in use by another account" }, { status: 400 });
      }
      updateData.email = email;
    }

    // Password Update Logic
    if (newPassword) {
      if (!user.password) {
        // User registered via OAuth originally, we can just set a new password
        updateData.password = await bcrypt.hash(newPassword, 10);
      } else {
        // User has a password, we must verify the current password first
        if (!currentPassword) {
          return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
      }
    }

    // Perform Update
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: { name: updatedUser.name, email: updatedUser.email }
    });

  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
