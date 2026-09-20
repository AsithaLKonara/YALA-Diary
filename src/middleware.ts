import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/guest") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/guest")) {
    const token = req.auth; // Auth.js automatically attaches the decoded JWT here!

    if (!token) {
      // Not authenticated
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    const role = token.role as string | undefined;

    // Admin/Staff routes protection
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (role !== "ADMIN" && role !== "STAFF") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/guest/dashboard", req.url));
      }
    }

    // Guest routes protection
    if (pathname.startsWith("/guest") || pathname.startsWith("/api/guest")) {
      if (role === "ADMIN" || role === "STAFF") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/guest/:path*", "/api/admin/:path*", "/api/guest/:path*"],
};
