'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import UserMenu from '@/components/user/UserMenu';
import SignIn from '@/components/sign-in';
import MobileNavigation from './MobileNavigation';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 bg-background border-b shadow-sm">
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
                {!hasMounted ? (
                  // Show loading placeholders during hydration
                  <>
                    <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
                    <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
                    <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
                    <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
                  </>
                ) : (
                  <>
                    <Link href="/">
                      <Button variant="ghost" className="text-base font-medium h-10 px-4">
                        Explore
                      </Button>
                    </Link>
                    <Link href="/playground">
                      <Button variant="ghost" className="text-base font-medium h-10 px-4">
                        Playground
                      </Button>
                    </Link>
                    <Link href="/categories">
                      <Button variant="ghost" className="text-base font-medium h-10 px-4">
                        Categories
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {!hasMounted ? (
                // Show loading state during hydration to prevent mismatch
                <>
                  <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
                  <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                </>
              ) : (
                <>
                  {session?.user ? (
                    <>
                      <Link href="/submit">
                        <Button className="bg-primary hover:bg-primary/90 text-base font-medium h-10 px-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Prompt
                        </Button>
                      </Link>
                      <UserMenu />
                    </>
                  ) : (
                    <SignIn />
                  )}
                  <ThemeToggle />
                </>
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