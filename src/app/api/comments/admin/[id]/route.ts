import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';

// DELETE a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await dbConnect();
    
    // Find the comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    // Remove comment reference from blog
    await Blog.findByIdAndUpdate(
      comment.blog,
      { $pull: { comments: comment._id } }
    );
    
    // Delete the comment
    await comment.deleteOne();
    
    return NextResponse.json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 