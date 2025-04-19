import { formatDistanceToNow } from 'date-fns';
import { UserIcon } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentProps {
  comment: {
    _id: string;
    name: string;
    content: string;
    createdAt: string;
  };
}

export default function Comment({ comment }: CommentProps) {
  const commentDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const initials = comment.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  return (
    <Card className="mb-4 bg-muted/40">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm leading-none">{comment.name}</p>
            <p className="text-xs text-muted-foreground">{commentDate}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <p className="text-sm text-foreground">{comment.content}</p>
      </CardContent>
    </Card>
  );
} 