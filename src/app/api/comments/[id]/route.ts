import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

// GET a single comment
export async function GET(
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
    
    return NextResponse.json(comment);
  } catch (error: any) {
    console.error('Error fetching comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH to approve/reject a comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { approved } = await request.json();
    
    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Approved status must be a boolean' }, { status: 400 });
    }
    
    await dbConnect();
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    comment.approved = approved;
    await comment.save();
    
    return NextResponse.json({
      success: true,
      message: approved ? 'Comment approved' : 'Comment rejected',
      comment
    });
  } catch (error: any) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a comment
export async function DELETE(
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