"use client";

import UserMenu from "@/components/user/UserMenu"
import Link from "next/link"
import Image from 'next/image'

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/images/sambatv-icon.png" 
              alt="SambaTV" 
              width={32} 
              height={32}
              className="rounded"
            />
            <h1 className="text-2xl font-bold">Prompt Library</h1>
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

