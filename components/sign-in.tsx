import { handleSignIn } from "@/app/actions/auth"
import config from "@/config";

export default function SignIn() {
	return (

		<form action={handleSignIn}>
			<button
				type="submit"
				className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"

			>
				Sign In
			</button>
		</form>
	);
} 