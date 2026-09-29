import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import { z } from 'zod';

// Values are trimmed before the length checks so whitespace-only input is
// rejected here instead of reaching Mongoose as an empty (required) field.
const updateBlogSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').optional(),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').optional(),
  content: z.string().trim().min(50, 'Content must be at least 50 characters').optional(),
  author: z.string().trim().min(2, 'Author must be at least 2 characters').optional(),
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

    return NextResponse.json(blog);
    
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE a blog
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();
    
    // Validate request body
    const validation = updateBlogSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Blog validation failed. Please fix the errors below and try again.',
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    
    const validatedData = validation.data;
    
    await dbConnect();
    
    // Find and update blog
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
    
  } catch (error: any) {
    console.error('Error updating blog:', error);
    
    if (error?.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update blog. Please try again.' },
      { status: 500 }
    );
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
    
    // Find and delete blog
    const blog = await Blog.findOneAndDelete({ slug });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });
    
    return NextResponse.json({ message: 'Blog deleted successfully' });
    
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
