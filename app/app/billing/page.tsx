import { redirect } from 'next/navigation';

export default function BillingPage() {
  // Redirect to profile page since billing is no longer needed
  redirect('/app/profile');
} 