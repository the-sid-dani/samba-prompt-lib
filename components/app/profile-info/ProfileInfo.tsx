import { getSupabaseClient } from '@/utils/supabase/server';
import { auth } from "@/lib/auth"

export async function ProfileInfo() {
	const supabase = await getSupabaseClient();
	const session = await auth()

	const userId = session?.user?.id
	if (!userId) {
		return <div>User not found</div>
	}

	const { data: userData, error: userError } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single();

	if (userError) {
		console.error('Error fetching user data:', userError);
		return <div>Error fetching user data</div>;
	}

	if (!userData) {
		return <div>User data not found</div>;
	}

	return (
		<div className="bg-[var(--background)] shadow rounded-lg p-6 space-y-8">
			{/* User Information */}
			<div>
				<h2 className="text-xl font-semibold mb-4">User Profile</h2>
				<div className="bg-[var(--background)] p-4 rounded-lg">
					<div className="space-y-3">
						<div>
							<label className="text-sm text-gray-600">Name</label>
							<p className="font-medium text-gray-900">{userData.name || 'Not set'}</p>
						</div>
						<div>
							<label className="text-sm text-gray-600">Email</label>
							<p className="font-medium text-gray-900">{userData.email}</p>
						</div>
						<div>
							<label className="text-sm text-gray-600">Account Type</label>
							<div className="mt-1">
								<span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border bg-primary/10 text-primary border-primary/20">
									SambaTV Employee
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{userData.image && (
				<div>
					<h2 className="text-xl font-semibold mb-4">Profile Image</h2>
					<img
						src={userData.image}
						alt="User avatar"
						className="w-20 h-20 rounded-full"
					/>
				</div>
			)}
		</div>
	);
}