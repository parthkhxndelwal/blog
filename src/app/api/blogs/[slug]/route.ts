import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
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
    const validatedData = updateBlogSchema.parse(body);
    
    await dbConnect();
    
    // Find and update blog
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
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