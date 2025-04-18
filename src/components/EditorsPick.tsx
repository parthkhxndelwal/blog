import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/types';
import connectDB from '@/lib/mongodb';
import PostModel from '@/models/Post';

async function getEditorsPicks(): Promise<Post[]> {
  await connectDB();
  const posts = await PostModel.find({ isEditorsPick: true })
    .populate('author', 'name image')
    .populate('topics', 'name slug')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  
  return posts;
}

function EditorsPickSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function EditorsPick() {
  const posts = await getEditorsPicks();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Editor's Pick</h2>
      <Suspense fallback={<EditorsPickSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/posts/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.topics.map((topic) => (
                      <span
                        key={topic._id}
                        className="px-2 py-1 bg-muted rounded-full text-xs"
                      >
                        {topic.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Suspense>
    </div>
  );
} 