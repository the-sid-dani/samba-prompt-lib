import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/utils/supabase/server';
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	const supabase = await getSupabaseClient();
	const session = await auth();
	
	const userId = session?.user?.id;
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get user data
	const { data: userData, error: userError } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single();

	if (userError) {
		return NextResponse.json({ error: userError.message }, { status: 500 });
	}

	return NextResponse.json({
		userData
	});
} 