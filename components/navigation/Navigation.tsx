'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import UserMenu from '@/components/user/UserMenu';
import SignIn from '@/components/sign-in';
import MobileNavigation from './MobileNavigation';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center space-x-3 group transition-transform hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all rounded-lg"></div>
                  <Image
                    src="/sambatv-logo.png"
                    alt="SambaTV"
                    width={150}
                    height={32}
                    className="relative h-8 w-auto"
                    priority
                  />
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    Explore
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="ghost" size="sm">
                    Categories
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="ghost" size="sm">
                    Leaderboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {session?.user ? (
                <>
                  <Link href="/submit">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-1" />
                      Create Prompt
                    </Button>
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <SignIn />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </>
  );
} 