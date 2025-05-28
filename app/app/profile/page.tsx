import { ProfileInfo } from '@/components/app/profile-info/ProfileInfo';

export default function ProfilePage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Profile</h1>
			<div className="grid gap-6 max-w-4xl">
				<ProfileInfo />
			</div>
		</div>
	);
}
