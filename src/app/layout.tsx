import './globals.css';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/ui/theme-provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BlogApp - Share Your Thoughts',
  description: 'A modern blog application with markdown support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
