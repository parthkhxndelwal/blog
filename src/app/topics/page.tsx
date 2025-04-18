import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TopicsList from '@/components/TopicsList';

export default function TopicsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Topics</h1>
        <p className="text-gray-600">
          Explore blog posts by their topics
        </p>
      </div>

      <Suspense fallback={<TopicsSkeleton />}>
        <TopicsList />
      </Suspense>
    </div>
  );
}

function TopicsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
} 