import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { FaCalendar, FaTag, FaUser } from 'react-icons/fa';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import LikeButton from '@/components/LikeButton';
import CommentComponent from '@/components/Comment';
import CommentFormWrapper from './CommentFormWrapper';

// Define TypeScript interfaces for better type safety
interface BlogDocument {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  likes: number;
  tags: string[];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  await dbConnect();
  const blogDoc = await Blog.findOne({ slug: params.slug }).lean();
  
  if (!blogDoc) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog could not be found.'
    };
  }
  
  // Cast to expected type with basic properties
  const blog = blogDoc as any;
  
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

async function getBlogBySlug(slug: string) {
  await dbConnect();
  
  const blog = await Blog.findOne({ slug }).lean();
  
  if (!blog) {
    return null;
  }
  
  const comments = await Comment.find({ 
    blog: (blog as any)._id,
    approved: true 
  })
    .sort({ createdAt: -1 })
    .lean();
  
  return {
    blog: JSON.parse(JSON.stringify(blog)),
    comments: JSON.parse(JSON.stringify(comments))
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const data = await getBlogBySlug(params.slug);
  
  if (!data) {
    notFound();
  }
  
  const { blog, comments } = data;
  const publishDate = format(new Date(blog.publishedAt), 'MMMM dd, yyyy');
  
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="mr-2 text-blue-500" />
              <span>{publishDate}</span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center">
                <FaTag className="mr-2 text-blue-500" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string) => (
                    <Link 
                      key={tag} 
                      href={`/blogs?tag=${tag}`}
                      className="text-blue-600 hover:underline"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {blog.coverImage && (
            <div className="relative w-full h-96 mb-8">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
        </header>
        
        {/* Blog Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
        
        {/* Like Button */}
        <div className="mb-12">
          <LikeButton blogId={blog._id} initialLikes={blog.likes} />
        </div>
        
        {/* Comments Section */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
          
          <CommentFormWrapper blogId={blog._id} />
          
          <div className="mt-8 space-y-6">
            {comments.map((comment: any) => (
              <CommentComponent key={comment._id} comment={comment} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 