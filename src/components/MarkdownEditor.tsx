import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  name?: string;
  required?: boolean;
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  className,
  name,
  required 
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={cn(
              'px-4 py-2 rounded-md',
              !isPreview ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={cn(
              'px-4 py-2 rounded-md',
              isPreview ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            Preview
          </button>
        </div>
      </div>

      {isPreview ? (
        <Card className="min-h-[500px]">
          <CardContent className="p-6 prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </CardContent>
        </Card>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[500px] font-mono"
          placeholder="Write your blog post in markdown..."
          name={name}
          required={required}
        />
      )}
    </div>
  );
} 