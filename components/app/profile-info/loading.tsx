export default function Loading() {
	return (
		<div className="bg-white shadow rounded-lg p-6 space-y-8">
			{/* User Information Skeleton */}
			<div>
				<h2 className="text-xl font-semibold mb-4">User Profile</h2>
				<div className="bg-gray-50 p-4 rounded-lg animate-pulse">
					<div className="space-y-3">
						<div>
							<div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
							<div className="h-5 w-32 bg-gray-300 rounded"></div>
						</div>
						<div>
							<div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
							<div className="h-5 w-48 bg-gray-300 rounded"></div>
						</div>
						<div>
							<div className="h-4 w-24 bg-gray-300 rounded mb-1"></div>
							<div className="h-6 w-36 bg-gray-300 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 