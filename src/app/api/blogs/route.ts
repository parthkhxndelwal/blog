import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import { saveMarkdownContent, getMarkdownBySlug } from '@/lib/markdown';
import { z } from 'zod';

// Schema for blog validation
const blogSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  author: z.string().min(2),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const limit = Number(searchParams.get('limit') || '10');
    const page = Number(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    await dbConnect();

    let query: any = {};

    if (slug) {
      // Get a single blog by slug
      const blog = await Blog.findOne({ slug }).populate({
        path: 'comments',
        match: { approved: true }
      });

      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      // Get markdown content
      const markdownContent = await getMarkdownBySlug(slug);
      
      if (!markdownContent) {
        return NextResponse.json({ error: 'Blog content not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        ...blog.toObject(), 
        content: markdownContent.content 
      });
    }

    // Filter by tag if provided
    if (tag) {
      query.tags = tag;
    }

    // Filter featured blogs if requested
    if (featured === 'true') {
      query.featured = true;
    }

    // Get blogs with pagination
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-comments');

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate blog data
    const validation = blogSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid blog data', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    await dbConnect();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ error: 'A blog with this title already exists' }, { status: 400 });
    }

    // Save markdown content
    const markdownData = {
      title: body.title,
      excerpt: body.excerpt,
      author: body.author,
      coverImage: body.coverImage || '',
      date: new Date().toISOString(),
      tags: body.tags || [],
      featured: body.featured || false
    };
    
    await saveMarkdownContent(slug, markdownData, body.content);

    // Create blog in MongoDB
    const blog = new Blog({
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content.substring(0, 200), // Store a preview
      markdownPath: `content/blogs/${slug}.md`,
      author: body.author,
      coverImage: body.coverImage || '',
      images: body.images || [],
      tags: body.tags || [],
      featured: body.featured || false
    });

    await blog.save();
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 