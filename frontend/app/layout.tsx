import { Inter } from 'next/font/google';
import { StoreProvider } from '../providers/StoreProvider';
import { UserProvider } from '../providers/UserProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OT Frontend',
  description: 'Open Transcription Frontend',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <StoreProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
