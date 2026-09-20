// middleware.ts — Edge-compatible NextAuth guard (JWT only, no Prisma)
// Prisma cannot run in Edge runtime — session is validated via JWT cookie only.
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Not authenticated — redirect to sign-in
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check role from JWT token (role is embedded during jwt() callback in auth.ts)
    const role = token.role as string | undefined;
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
