'use client';

import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-primary hover:text-primary/90">
              BlogApp
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your thoughts with the world
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="link" className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground">
                <Link href="/">
                  Home
                </Link>
              </Button>
              <Button asChild variant="link" className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground">
                <Link href="/blogs">
                  Blogs
                </Link>
              </Button>
              <Button asChild variant="link" className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground">
                <Link href="/admin">
                  Admin
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" asChild>
                <a href="#" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" asChild>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} BlogApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 