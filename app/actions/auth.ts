'use server'

import { signIn, signOut } from "@/lib/auth"

export async function handleSignIn() {
	// magic link and google both 
	await signIn("credentials", { redirectTo: "/" })
	//redirect to home page
	// redirect("/")
	// await signIn("nodemailer", { redirectTo: "/" })
}

export async function handleSignOut() {
	await signOut({ redirectTo: "/" })
} 