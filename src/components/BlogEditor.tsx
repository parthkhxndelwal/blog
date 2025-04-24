'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import the base SimpleMDE CSS
import 'easymde/dist/easymde.min.css';
// Import our custom theme
import '@/styles/simplemde.css';

// Dynamically import SimpleMDE with no SSR
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] border rounded-md p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  ),
});

interface BlogEditorProps {
  initialData?: {
    _id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    author?: string;
    coverImage?: string;
    tags?: string[];
    featured?: boolean;
  };
  mode: 'create' | 'edit';
}

export default function BlogEditor({ initialData = {}, mode }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [content, setContent] = useState(initialData.content || '');
  const [author, setAuthor] = useState(initialData.author || '');
  const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
  const [featured, setFeatured] = useState(initialData.featured || false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Generate slug from title
  useEffect(() => {
    if (mode === 'create' && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      setSlug(generatedSlug);
    }
  }, [title, slug, mode]);
  
  // Use memoized options to prevent re-renders
  const editorOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      placeholder: 'Write your blog content in Markdown...',
      status: false,
      autoSave: {
        enabled: false
      },
      disabled: isSubmitting,
      toolbar: [
        'bold', 'italic', 'heading', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide'
      ] as const
    };
  }, [isSubmitting]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setErrorDetails(null);
    setSuccess(null);
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const blogData = {
        title,
        excerpt,
        content,
        author,
        coverImage,
        tags: tagsArray,
        featured
      };
      
      let response;
      
      if (mode === 'create') {
        response = await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(blogData)
        });
      } else {
        response = await fetch(`/api/blogs/${initialData.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(blogData)
        });
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(mode === 'create' ? 'Blog created successfully!' : 'Blog updated successfully!');
        
        // Redirect to the blog list after a successful create
        if (mode === 'create') {
          setTimeout(() => {
            router.push('/admin/blogs');
          }, 1500);
        }
      } else {
        setError(data.error || 'Failed to save blog. Please try again.');
        if (data.details) {
          console.error('Validation errors:', data.details);
          setErrorDetails(data.details);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Blog submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create New Blog' : 'Edit Blog'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {errorDetails && (
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {Object.keys(errorDetails).map(field => (
                      <li key={field}>
                        {field}: {errorDetails[field]?._errors?.join(', ')}
                      </li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title * (min 3 characters)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={mode === 'edit' ? "bg-muted" : ""}
                  disabled={mode === 'edit' || isSubmitting}
                  readOnly={mode === 'edit'}
                />
                <p className="text-xs text-muted-foreground">
                  {mode === 'edit' ? 'Slug cannot be changed after creation' : 'Will be generated automatically if left empty'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt * (min 10 characters)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                disabled={isSubmitting}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content * (min 50 characters)</Label>
              <div className="border rounded-md">
                <SimpleMDE
                  value={content}
                  onChange={setContent}
                  options={editorOptions}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author">Author * (min 2 characters)</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isSubmitting}
                placeholder="technology, programming, web development"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(checked) => setFeatured(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="featured">Feature this blog</Label>
            </div>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Blog' : 'Update Blog'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 