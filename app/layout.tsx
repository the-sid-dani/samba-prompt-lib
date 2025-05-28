import type { Metadata } from "next";
import config from "@/config";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google'
import { OpenPanelComponent } from '@openpanel/nextjs';
import { SessionProvider } from "next-auth/react"
import { Toaster } from '@/components/ui/toaster';
import FooterWrapper from "@/components/ui/FooterWrapper";
import { ReactNode } from 'react';

export const metadata: Metadata = config.metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        <body
          className="antialiased min-h-screen flex flex-col"
        >
          <Toaster />
          <main className="flex-grow">
            {children}
          </main>
          <FooterWrapper />
        </body>
      </SessionProvider>
      {/* Google Tag Manager */}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
      
      {/* OpenPanel Analytics */}
      {process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID && (
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
          trackScreenViews={true}
          // trackAttributes={true}
          // trackOutgoingLinks={true}
          // If you have a user id, you can pass it here to identify the user
          // profileId={'123'}
        />
      )}
    </html>
  );
}
