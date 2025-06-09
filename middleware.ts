import authConfig from "@/lib/auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'

export const config = {
	matcher: ["/submit", "/favorites", "/profile", "/admin/:path*"],
};

const { auth } = NextAuth(authConfig)

export default auth((req) => {
	// Check if the request is for an admin route
	if (req.nextUrl.pathname.startsWith('/admin')) {
		// Check if user has admin privileges (SambaTV email)
		if (!req.auth?.user?.email?.endsWith('@samba.tv')) {
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}
	}

	// For other protected routes, just check if authenticated
	if (!req.auth) {
		return NextResponse.redirect(new URL("/auth/signin", req.url));
	}
});