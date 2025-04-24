'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  blogId: string;
  initialLikes: number;
}

export default function LikeButton({ blogId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (hasLiked || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLikes(data.likes);
        setHasLiked(true);
        // Save liked state to localStorage to prevent multiple likes
        localStorage.setItem(`liked_${blogId}`, 'true');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check localStorage on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasLikedFromStorage = localStorage.getItem(`liked_${blogId}`) === 'true';
      setHasLiked(hasLikedFromStorage);
    }
  }, [blogId]);
  
  return (
    <Button
      onClick={handleLike}
      disabled={hasLiked || isLoading}
      variant="ghost"
      size="sm"
      className={cn(
        "px-2 py-1 h-auto",
        hasLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
      )}
      aria-label="Like this post"
    >
      <Heart className={cn(
        "mr-1 h-4 w-4", 
        hasLiked && "fill-current"
      )} />
      <span>{likes}</span>
    </Button>
  );
} 