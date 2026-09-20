// middleware.ts — NextAuth admin guard
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect all /admin/** routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      // Not authenticated — redirect to sign-in
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Authenticated but not ADMIN or STAFF role
    const role = (req.auth.user as { role?: string })?.role;
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
