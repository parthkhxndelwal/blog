import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import { saveMarkdownContent, getMarkdownBySlug, deleteMarkdownContent } from '@/lib/markdown';
import { z } from 'zod';

const updateBlogSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().min(10).optional(),
  content: z.string().min(50).optional(),
  author: z.string().min(2).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});

// GET a single blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    await dbConnect();
    
    // Find blog in database
    const blog = await Blog.findOne({ slug }).populate({
      path: 'comments',
      match: { approved: true },
      options: { sort: { createdAt: -1 } }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get markdown content
    const markdownContent = await getMarkdownBySlug(slug);
    
    if (!markdownContent) {
      return NextResponse.json({ error: 'Blog content not found' }, { status: 404 });
    }

    // Return combined data
    return NextResponse.json({
      ...blog.toObject(),
      content: markdownContent.content
    });
    
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT to update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();
    
    // Validate update data
    const validation = updateBlogSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid blog data', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    await dbConnect();
    
    // Find the blog
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get current markdown content to preserve it if not updating content
    const currentMarkdown = await getMarkdownBySlug(slug);
    if (!currentMarkdown && !body.content) {
      return NextResponse.json({ error: 'Blog content not found' }, { status: 404 });
    }

    // Update fields if provided
    if (body.title) blog.title = body.title;
    if (body.excerpt) blog.excerpt = body.excerpt;
    if (body.author) blog.author = body.author;
    if (body.coverImage !== undefined) blog.coverImage = body.coverImage;
    if (body.tags) blog.tags = body.tags;
    if (body.featured !== undefined) blog.featured = body.featured;
    if (body.images) blog.images = body.images;
    
    // Content preview (first 200 chars) if content is updated
    if (body.content) {
      blog.content = body.content.substring(0, 200);
    }
    
    blog.updatedAt = new Date();
    
    // If there's new content, update the markdown file
    if (body.content || body.title || body.tags || body.excerpt || body.coverImage !== undefined || body.featured !== undefined) {
      const markdownData = {
        title: blog.title,
        excerpt: blog.excerpt,
        author: blog.author,
        coverImage: blog.coverImage,
        date: blog.publishedAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
        tags: blog.tags,
        featured: blog.featured
      };
      
      const content = body.content || currentMarkdown?.content || '';
      await saveMarkdownContent(slug, markdownData, content);
    }
    
    await blog.save();
    return NextResponse.json(blog);
    
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    await dbConnect();
    
    // Find the blog
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });
    
    // Delete the blog from database
    await blog.deleteOne();
    
    // Delete the markdown file
    await deleteMarkdownContent(slug);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 