import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import dbConnect from "@/lib/mongoose";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";

// Import and explicitly reference both models to ensure registration
// This helps with Next.js server component loading
const models = { Blog, Comment };

// Define interface to match the expected BlogCard props
interface SerializedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  likes: number;
  comments: any[];
  tags: string[];
}

async function getFeaturedBlogs(): Promise<SerializedBlog[]> {
  await dbConnect();
  
  // Ensure models are registered before querying
  console.log(`Models loaded: Blog=${!!models.Blog}, Comment=${!!models.Comment}`);
  
  try {
    const blogs = await Blog.find({ featured: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .populate({
        path: 'comments',
        match: { approved: true }
      })
      .lean();
    
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
}

async function getRecentBlogs(): Promise<SerializedBlog[]> {
  await dbConnect();
  
  try {
    const blogs = await Blog.find()
      .sort({ publishedAt: -1 })
      .limit(6)
      .populate({
        path: 'comments',
        match: { approved: true }
      })
      .lean();
    
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return [];
  }
}

export default async function Home() {
  const featuredBlogs = await getFeaturedBlogs();
  const recentBlogs = await getRecentBlogs();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to BlogApp
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A modern platform for sharing your thoughts and ideas with the world
            </p>
            <Link 
              href="/blogs" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-md font-medium text-lg inline-block"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredBlogs.map((blog: SerializedBlog) => (
                <BlogCard key={blog._id} blog={blog} isFeatured={true} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Recent Blogs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Blogs</h2>
            <Link 
              href="/blogs" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((blog: SerializedBlog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Share Your Story?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start writing and publishing your own blogs today.
          </p>
          <Link 
            href="/admin" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-lg inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
