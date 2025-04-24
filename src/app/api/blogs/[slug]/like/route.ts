import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';

// POST to like a blog
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blogId = params.slug;
    
    await dbConnect();
    
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ likes: blog.likes });
    
  } catch (error: any) {
    console.error('Error liking blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 