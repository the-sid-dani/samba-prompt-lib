import { ReactNode } from 'react';

// Route segment config for static pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface StaticLayoutProps {
  children: ReactNode;
}

// Layout for static pages (terms, privacy, etc.)
export default function StaticLayout({ children }: StaticLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 