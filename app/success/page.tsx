export default function SuccessPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-green-600">Success!</h1>
				<p className="mt-2 text-gray-600">Your action was completed successfully.</p>
				<a href="/app" className="mt-4 inline-block text-primary hover:underline">
					Return to App →
				</a>
			</div>
		</div>
	);
}

