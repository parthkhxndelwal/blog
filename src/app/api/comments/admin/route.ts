import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    
    // Filter by status if provided
    if (status === 'pending') {
      query = { approved: false };
    } else if (status === 'approved') {
      query = { approved: true };
    }
    
    const comments = await Comment.find(query)
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
} 