import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Simple in-memory rate limiter (Warning: Resets on server restart / serverless function spin down)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  try {
    // --- Rate Limiting ---
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    let limitData = rateLimitMap.get(ip);
    
    if (!limitData || (now - limitData.lastReset > RATE_LIMIT_WINDOW_MS)) {
      limitData = { count: 1, lastReset: now };
    } else {
      limitData.count += 1;
    }
    rateLimitMap.set(ip, limitData);

    if (limitData.count > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many registration attempts from this IP. Please try again later." },
        { status: 429 }
      );
    }
    // ---------------------

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "GUEST",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      { user, message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
