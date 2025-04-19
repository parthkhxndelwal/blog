import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { FaCalendar, FaTag, FaUser } from 'react-icons/fa';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import { getMarkdownBySlug, parseMarkdown } from '@/lib/markdown';
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
  htmlContent: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  likes: number;
  tags: string[];
}

interface CommentDocument {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
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
  
  const markdownContent = await getMarkdownBySlug(slug);
  
  if (!markdownContent) {
    return null;
  }
  
  const comments = await Comment.find({ 
    blog: (blog as any)._id,
    approved: true 
  })
    .sort({ createdAt: -1 })
    .lean();
  
  return {
    blog: {
      ...JSON.parse(JSON.stringify(blog)),
      content: markdownContent.content,
      htmlContent: parseMarkdown(markdownContent.content)
    },
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
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image 
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </header>
        
        {/* Blog Content */}
        <article className="prose prose-lg max-w-none prose-blue mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.htmlContent }} />
        </article>
        
        {/* Like and Share */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Like this post</span>
            <LikeButton slug={blog.slug} initialLikes={blog.likes} />
          </div>
          {/* Share functionality can be added here */}
        </div>
        
        {/* Comments Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
          
          {comments.length > 0 ? (
            <div className="space-y-6 mb-8">
              {comments.map((comment: CommentDocument) => (
                <CommentComponent key={comment._id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
              <p className="text-gray-600">No comments yet. Be the first to leave a comment!</p>
            </div>
          )}
          
          <CommentFormWrapper blogId={blog._id} />
        </section>
      </div>
    </div>
  );
} 