import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import type { Provider } from "next-auth/providers/index"

// Validate environment variables at startup
const validateEnvVars = () => {
  const required = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.error("[NextAuth] Missing required environment variables:", missing.join(", "))
    console.error("[NextAuth] Please check the Vars section in the v0 sidebar to add these variables")
  }

  return missing.length === 0
}

// Manual Google provider configuration to avoid import issues
const GoogleProvider = (options: {
  clientId: string
  clientSecret: string
  authorization?: any
}): Provider => {
  return {
    id: "google",
    name: "Google",
    type: "oauth",
    wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
    authorization: options.authorization || { params: { scope: "openid email profile" } },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret,
  }
}

// Check environment variables
const hasValidConfig = validateEnvVars()

export const authOptions: NextAuthOptions = {
  providers: hasValidConfig
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: {
              prompt: "select_account",
              scope: "openid email profile",
              hd: "ucdavis.edu", // Restrict to UC Davis domain
            },
          },
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Strictly check if email ends with @ucdavis.edu
      const email = user.email || ""
      const isUCDavisEmail = email.toLowerCase().endsWith("@ucdavis.edu")

      if (!isUCDavisEmail) {
        return "/api/auth/error?error=AccessDenied"
      }

      return true
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub || ""
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/", // Redirect to home on error
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  debug: true, // Enable debug mode to see more error details
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
