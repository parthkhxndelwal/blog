'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SimpleMDE from 'react-simplemde-editor';
import '@/styles/easymde.min.css';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
      }
    };
  }, []);
  
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
      
      console.log('Submitting blog data:', blogData);
      
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
          method: 'PUT',
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
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive p-4 rounded-md mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              {errorDetails && (
                <div className="mt-2 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.keys(errorDetails).map(field => (
                      <li key={field}>
                        {field}: {errorDetails[field]?._errors?.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 p-4 rounded-md mb-6">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt * (min 10 characters)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              required
              disabled={isSubmitting}
            />
          </div>
          
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="technology, programming, web"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked as boolean)}
              disabled={isSubmitting}
            />
            <label 
              htmlFor="featured" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Featured Blog
            </label>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="content">Content * (min 50 characters)</Label>
            <SimpleMDE 
              value={content}
              onChange={setContent}
              options={editorOptions}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Blog' : 'Update Blog'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 