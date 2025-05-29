'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Plus, Grid, User, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import SignIn from '@/components/sign-in';
import config from '@/config';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
  ];

  const userItems = [
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/submit', label: 'Create Prompt', icon: Plus },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-6 pb-3">
          <SheetTitle>
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/images/sambatv-icon.png" 
                alt="SambaTV" 
                width={32} 
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold">{config.metadata.title}</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="px-6 pb-6">
          {user && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-medium truncate">{user.email}</p>
            </div>
          )}
        </div>

        <Separator />

        <nav className="p-6">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </li>
              );
            })}
          </ul>

          {user && (
            <>
              <Separator className="my-4" />
              <ul className="space-y-1">
                {userItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </nav>

        <div className="p-6 mt-auto">
          {user ? (
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="w-full">
                <SignIn />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Sign in to create and save prompts
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 