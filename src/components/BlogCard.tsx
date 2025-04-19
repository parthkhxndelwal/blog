import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Heart } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    coverImage: string;
    publishedAt: string;
    likes: number;
    comments: any[];
    tags: string[];
  };
  isFeatured?: boolean;
}

export default function BlogCard({ blog, isFeatured = false }: BlogCardProps) {
  const publishDate = formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true });
  
  return (
    <Card className={cn(
      "overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1", 
      isFeatured && "md:col-span-2 md:grid md:grid-cols-2"
    )}>
      <div className={cn(
        "relative w-full", 
        isFeatured ? "h-60 md:h-full" : "h-48",
        isFeatured && "md:col-span-1"
      )}>
        {blog.coverImage ? (
          <Image 
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/30" />
        )}
        {blog.tags && blog.tags.length > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary">
              {blog.tags[0]}
            </Badge>
          </div>
        )}
      </div>
      
      <div className={cn(
        isFeatured && "md:col-span-1"
      )}>
        <CardHeader>
          <CardTitle className={isFeatured ? "text-2xl" : "text-xl"}>
            <Link href={`/blogs/${blog.slug}`} className="hover:text-primary transition-colors">
              {blog.title}
            </Link>
          </CardTitle>
          <CardDescription>
            By {blog.author} • {publishDate}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">{blog.excerpt}</p>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between">
          <Button variant="link" asChild className="px-0">
            <Link href={`/blogs/${blog.slug}`}>
              Read More
            </Link>
          </Button>
          
          <div className="flex space-x-3 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart size={16} className="text-destructive" />
              <span className="text-sm">{blog.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare size={16} className="text-primary" />
              <span className="text-sm">{blog.comments?.length || 0}</span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
} 