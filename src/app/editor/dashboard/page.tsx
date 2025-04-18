'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditorDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not an editor
  if (!session?.user || session.user.role !== 'editor') {
    router.push('/');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Editor Dashboard</h1>
        <Link href="/editor/posts/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/editor/posts">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Manage Posts</h2>
            <p className="text-gray-600">Create, edit, and delete blog posts</p>
          </div>
        </Link>

        <Link href="/editor/topics">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Manage Topics</h2>
            <p className="text-gray-600">Create and manage blog topics</p>
          </div>
        </Link>

        <Link href="/editor/picks">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Editor's Picks</h2>
            <p className="text-gray-600">Manage featured posts</p>
          </div>
        </Link>

        <Link href="/editor/requests">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Editor Requests</h2>
            <p className="text-gray-600">Review and manage editor access requests</p>
          </div>
        </Link>
      </div>
    </div>
  );
} 