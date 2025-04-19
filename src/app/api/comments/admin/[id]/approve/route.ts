import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

// POST to approve a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await dbConnect();
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    // Approve the comment
    comment.approved = true;
    await comment.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment approved',
      comment
    });
  } catch (error: any) {
    console.error('Error approving comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 