import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"

// Extend the Session type to include supabaseAccessToken
declare module 'next-auth' {
	interface Session {
		supabaseAccessToken?: string
	}
}

// Create NextAuth instance
const handler = NextAuth({
	...authConfig,
	providers: [
		...authConfig.providers,
		// Email provider removed to avoid Edge Runtime issues
		// Email authentication can be handled via API routes if needed
	],
})

// Export handlers and auth functions
export const { handlers, auth, signIn, signOut } = handler
export const { GET, POST } = handlers