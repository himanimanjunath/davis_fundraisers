import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase() || ""
      const isUCDavisEmail = email.endsWith("@ucdavis.edu")
      return isUCDavisEmail ? true : "/api/auth/error?error=AccessDenied"
    },

    async jwt({ token }) {
      // Default role assignment
      if (!token.role) token.role = "user"
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ""
        session.user.role = (token.role as "user" | "admin") ?? "user" // FIX ✔
      }
      return session
    },
  },

  pages: {
    signIn: "/",
    error: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
