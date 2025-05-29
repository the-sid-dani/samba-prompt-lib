'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import SignIn from '@/components/sign-in';
import UserMenu from '@/components/user/UserMenu';
import MobileNavigation from './MobileNavigation';
import config from '@/config';

interface NavigationProps {
  showCreateButton?: boolean;
}

export default function Navigation({ showCreateButton = true }: NavigationProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <MobileNavigation />
            
            {/* Logo - Hidden on mobile when menu is present */}
            <Link href="/" className="flex items-center space-x-2 ml-2 md:ml-0">
              <Image 
                src="/images/sambatv-icon.png" 
                alt="SambaTV" 
                width={32} 
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">{config.metadata.title}</span>
              <span className="text-lg font-bold text-gray-900 sm:hidden">Prompts</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Home
            </Link>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {showCreateButton && (
                  <Link href="/submit" className="hidden sm:inline-flex">
                    <Button variant="outline" size="default" className="hidden sm:inline-flex">
                      Create Prompt
                    </Button>
                    <Button variant="outline" size="sm" className="sm:hidden">
                      <span className="sr-only">Create</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </Link>
                )}
                <UserMenu />
              </>
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 