"use client";
import React from 'react';
import Link from 'next/link';
import { LogOut, User, Shield } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserMenu() {
	const { data: session } = useSession();
	const user = session?.user;

	const handleSignOut = () => {
		signOut();
	};

	if (!user) return null;

	// Check if user is admin (has @samba.tv email)
	const isAdmin = user.email?.endsWith('@samba.tv');

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button 
					variant="ghost" 
					className="flex items-center space-x-3 hover:bg-transparent p-0 h-auto"
					aria-label={`User menu for ${user.name || user.email || 'user'}`}
					aria-expanded="false"
					aria-haspopup="menu"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage 
							src={user.image || undefined} 
							alt={`${user.name || 'User'} avatar`} 
						/>
						<AvatarFallback>
							{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
						</AvatarFallback>
					</Avatar>
					<span className="hidden md:flex items-center space-x-1">
						<span className="text-sm font-medium text-foreground">
							{user.name || user.email}
						</span>
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem asChild>
					<Link
						href="/profile"
						className="flex items-center cursor-pointer"
					>
						<User className="mr-3 h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				{isAdmin && (
					<DropdownMenuItem asChild>
						<Link
							href="/admin"
							className="flex items-center cursor-pointer"
						>
							<Shield className="mr-3 h-4 w-4" />
							Admin Dashboard
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleSignOut}
					className="cursor-pointer text-destructive focus:text-destructive"
				>
					<LogOut className="mr-3 h-4 w-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}