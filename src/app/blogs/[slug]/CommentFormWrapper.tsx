'use client';

import { useState } from 'react';
import CommentForm from '@/components/CommentForm';

interface CommentFormWrapperProps {
  blogId: string;
}

export default function CommentFormWrapper({ blogId }: CommentFormWrapperProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentSubmitted = () => {
    // This will trigger a refresh of the comments list
    // In a more advanced implementation, you could fetch the new comments
    // directly using SWR or React Query instead of a full page refresh
    setRefreshKey(prev => prev + 1);
    
    // Optionally trigger a page refresh to show the new comment after moderation
    // window.location.reload();
  };

  return (
    <CommentForm
      key={refreshKey}
      blogId={blogId}
      onCommentSubmitted={handleCommentSubmitted}
    />
  );
} 