"use client";

import { useSession } from "next-auth/react";
import UserMenu from "@/components/user/UserMenu";
import SignIn from "@/components/sign-in";

function UserMenuContent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <UserMenuFallback />;
  }
  
  if (session?.user) {
    return <UserMenu />;
  }

  return <SignIn />;
}

function UserMenuFallback() {
  return (
    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
  );
}

export function UserMenuSuspense() {
  return <UserMenuContent />;
} 