'use client';

import { useState, FormEvent } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CommentFormProps {
  blogId: string;
  onCommentSubmitted: () => void;
}

export default function CommentForm({ blogId, onCommentSubmitted }: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !content) {
      setMessage({
        text: 'All fields are required',
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blog: blogId,
          name,
          email,
          content
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setName('');
        setEmail('');
        setContent('');
        setMessage({
          text: 'Comment submitted for moderation. Thank you!',
          type: 'success'
        });
        onCommentSubmitted();
      } else {
        setMessage({
          text: data.error || 'Failed to submit comment. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'An error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Leave a Comment</CardTitle>
      </CardHeader>
      
      <CardContent>
        {message && (
          <div className={`p-3 mb-4 rounded-md flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Comment</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 