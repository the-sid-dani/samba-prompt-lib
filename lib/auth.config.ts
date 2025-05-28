import NextAuth, { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const authConfig = {
	secret: process.env.AUTH_SECRET,
	providers: [
		GoogleProvider({
			allowDangerousEmailAccountLinking: true,
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
					hd: "samba.tv" // Restrict to @samba.tv domain only
				}
			}
		}),
	],
	adapter: SupabaseAdapter({
		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		secret: process.env.SUPABASE_SECRET_KEY!,
	}),
	callbacks: {
		async signIn({ user, account, profile }) {
			// Only allow sign-in for @samba.tv email addresses
			if (user.email && !user.email.endsWith('@samba.tv')) {
				return false; // Reject sign-in
			}
			return true; // Allow sign-in
		},
		async session({ session, user }) {
			const signingSecret = process.env.SUPABASE_JWT_SECRET

			if (signingSecret) {
				const payload = {
					aud: "authenticated",
					exp: Math.floor(new Date(session.expires).getTime() / 1000),
					sub: user.id,
					email: user.email,
					role: "authenticated",
				}

				const secretKey = new TextEncoder().encode(signingSecret)
				const jose = await import('jose')
				session.supabaseAccessToken = await new jose.SignJWT(payload)
					.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
					.sign(secretKey)
			}
			return session
		},
	},
} satisfies NextAuthConfig

export const { auth } = NextAuth(authConfig)

export default authConfig