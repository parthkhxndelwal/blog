'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            Blog
          </Link>
          <Link href="/topics" className="text-gray-600 hover:text-gray-900">
            Topics
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === 'editor' && (
                <Link href="/editor/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback>
                      {user.name?.[0] || user.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {user.role !== 'editor' && !user.editorRequest && (
                    <DropdownMenuItem>
                      <Link href="/request-editor">Request Editor Access</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
} 