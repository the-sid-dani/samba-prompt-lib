import NextAuth, { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"

// Check if Supabase environment variables are available
const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

const authConfig = {
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/auth/signin',
	},
	session: {
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	providers: [
		GoogleProvider({
			allowDangerousEmailAccountLinking: true,
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
					// Removed hd restriction to allow all Google accounts
				}
			},
			// Disable PKCE in development to fix callback issues
			checks: process.env.NODE_ENV === 'development' ? [] : ["pkce", "state"]
		}),
	],
	// Only use Supabase adapter if environment variables are available
	...(hasSupabaseConfig && {
		adapter: SupabaseAdapter({
			url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
			secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
		}),
	}),
	callbacks: {
		async signIn({ user, account, profile }) {
			// Allow all users to sign in (they will be created with 'member' role by default)
			
			// Track analytics for user sign-in
			try {
				const { Analytics } = await import('@/lib/analytics')
				
				await Analytics.trackEvent({
					userId: user.id,
					eventType: 'user_signin',
					eventData: {
						email: user.email,
						name: user.name,
						provider: account?.provider || 'unknown'
					}
				})
			} catch (analyticsError) {
				console.error('Failed to track auth analytics:', analyticsError)
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
	debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig

export const { auth } = NextAuth(authConfig)

export default authConfig