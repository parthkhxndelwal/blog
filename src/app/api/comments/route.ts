import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import { z } from 'zod';

// Schema for comment validation
const commentSchema = z.object({
  blog: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  content: z.string().min(3).max(500)
});

// GET comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog');
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Get approved comments for the blog
    const comments = await Comment.find({ 
      blog: blogId,
      approved: true 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate comment data
    const validation = commentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid comment data', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    await dbConnect();
    
    // Check if blog exists
    const blog = await Blog.findById(body.blog);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Create new comment (initially not approved)
    const comment = new Comment({
      blog: body.blog,
      name: body.name,
      email: body.email,
      content: body.content,
      approved: false // Requires moderation
    });
    
    await comment.save();
    
    // Add comment reference to blog
    blog.comments.push(comment._id);
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment submitted for moderation',
      comment: {
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 