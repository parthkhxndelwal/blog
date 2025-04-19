import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';

export async function GET() {
  try {
    await dbConnect();
    
    const totalBlogs = await Blog.countDocuments();
    const featuredBlogs = await Blog.countDocuments({ featured: true });
    const totalComments = await Comment.countDocuments();
    const pendingComments = await Comment.countDocuments({ approved: false });
    const tags = await Blog.distinct('tags');
    
    // Get recent blogs
    const recentBlogs = await Blog.find()
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title slug publishedAt')
      .lean();
    
    // Get recent comments
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('blog', 'title slug')
      .lean();
    
    return NextResponse.json({
      totalBlogs,
      featuredBlogs,
      totalComments,
      pendingComments,
      tagsCount: tags.length,
      recentBlogs: JSON.parse(JSON.stringify(recentBlogs)),
      recentComments: JSON.parse(JSON.stringify(recentComments))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 