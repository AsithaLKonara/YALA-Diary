import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role ?? "GUEST";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
