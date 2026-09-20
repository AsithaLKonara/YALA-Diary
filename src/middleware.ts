import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/guest") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/guest")) {
    const session = req.auth; // Auth.js automatically attaches the Session object here
    console.log("MIDDLEWARE SESSION:", JSON.stringify(session, null, 2));

    if (!session) {
      // Not authenticated
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session.user as any)?.role as string | undefined;

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
