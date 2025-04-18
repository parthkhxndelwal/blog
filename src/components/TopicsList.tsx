import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Topic } from '@/types';
import connectDB from '@/lib/mongodb';
import TopicModel from '@/models/Topic';

async function getTopics(): Promise<Topic[]> {
  await connectDB();
  const topics = await TopicModel.find()
    .populate('createdBy', 'name')
    .populate('posts')
    .sort({ createdAt: -1 })
    .lean();
  
  return topics;
}

export default async function TopicsList() {
  const topics = await getTopics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <Link key={topic._id} href={`/topics/${topic.slug}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{topic.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">
                {topic.description || 'No description available'}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <span>{topic.posts.length} posts</span>
                <span className="mx-2">•</span>
                <span>Created by {topic.createdBy.name}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 