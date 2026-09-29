import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import { z } from 'zod';

// Schema for blog validation
// Values are trimmed before the length checks so whitespace-only input is
// rejected here instead of reaching Mongoose as an empty (required) field.
const blogSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().trim().min(50, 'Content must be at least 50 characters'),
  author: z.string().trim().min(2, 'Author must be at least 2 characters'),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});

// Build a URL-safe slug from the (already trimmed) title.
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // A title made up entirely of non-alphanumeric characters has no slug to
  // derive; fall back to a unique placeholder instead of failing validation.
  return slug || `post-${Date.now()}`;
}

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

      return NextResponse.json(blog);
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

    // Validate request body
    const validation = blogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Blog validation failed. Please fix the errors below and try again.',
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    await dbConnect();

    const slug = generateSlug(validatedData.title);

    // Slugs must be unique; return a clear 409 instead of a raw duplicate-key error
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      return NextResponse.json(
        {
          error: 'A blog with a similar title already exists.',
          details: { title: ['Please use a different title.'] }
        },
        { status: 409 }
      );
    }

    // Create new blog
    const blog = await Blog.create({
      ...validatedData,
      slug,
      publishedAt: new Date()
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);

    // Duplicate slug race (two creates with the same title at the same time)
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          error: 'A blog with a similar title already exists.',
          details: { title: ['Please use a different title.'] }
        },
        { status: 409 }
      );
    }

    if (error?.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create blog. Please try again.' },
      { status: 500 }
    );
  }
}
