import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Post } from '@/types';
import connectDB from '@/lib/mongodb';
import PostModel from '@/models/Post';

async function getEditorsPicks(): Promise<Post[]> {
  await connectDB();
  const posts = await PostModel.find({ isEditorsPick: true })
    .populate('author')
    .populate('topics')
    .limit(5)
    .sort({ createdAt: -1 })
    .lean();
  
  return posts;
}

export default async function EditorsPicks() {
  const posts = await getEditorsPicks();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post._id} href={`/posts/${post.slug}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">
                {post.content.substring(0, 150)}...
              </p>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>By {post.author.name}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 