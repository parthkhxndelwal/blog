'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MenuIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                BlogApp
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                  isActive('/')
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                Home
              </Link>
              <Link
                href="/blogs"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                  isActive('/blogs')
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                Blogs
              </Link>
              <Link
                href="/components"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                  isActive('/components')
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                Components
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
            <ModeToggle />
            <Button asChild>
              <Link href="/admin">
                Admin Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center sm:hidden">
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={cn(
              "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
              isActive('/')
                ? "bg-primary/10 border-primary text-primary"
                : "border-transparent text-muted-foreground hover:bg-muted hover:border-muted hover:text-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className={cn(
              "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
              isActive('/blogs')
                ? "bg-primary/10 border-primary text-primary"
                : "border-transparent text-muted-foreground hover:bg-muted hover:border-muted hover:text-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Blogs
          </Link>
          <Link
            href="/components"
            className={cn(
              "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
              isActive('/components')
                ? "bg-primary/10 border-primary text-primary"
                : "border-transparent text-muted-foreground hover:bg-muted hover:border-muted hover:text-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Components
          </Link>
          <Link
            href="/admin"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted-foreground hover:bg-muted hover:border-muted hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
} 