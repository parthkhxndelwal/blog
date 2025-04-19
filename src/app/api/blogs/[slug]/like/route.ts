import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';

// POST to like a blog
export async function POST(
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
    
    // Increment likes
    blog.likes = (blog.likes || 0) + 1;
    await blog.save();
    
    return NextResponse.json({
      success: true,
      likes: blog.likes
    });
  } catch (error: any) {
    console.error('Error liking blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 