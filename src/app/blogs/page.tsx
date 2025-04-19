import { Suspense } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';

async function getBlogs(page = 1, limit = 9, tag?: string) {
  await dbConnect();
  
  const skip = (page - 1) * limit;
  const query = tag ? { tags: tag } : {};
  
  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'comments',
      match: { approved: true }
    })
    .lean();
  
  return {
    blogs: JSON.parse(JSON.stringify(blogs)),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

async function getTags() {
  await dbConnect();
  const tags = await Blog.distinct('tags');
  return tags;
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const tag = searchParams.tag || '';
  
  const { blogs, pagination } = await getBlogs(page, 9, tag);
  const tags = await getTags();
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blogs</h1>
        
        {/* Tags Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blogs"
              className={`px-3 py-1 rounded-full text-sm ${
                !tag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </Link>
            
            {tags.map((tagItem) => (
              <Link
                key={tagItem}
                href={`/blogs?tag=${tagItem}`}
                className={`px-3 py-1 rounded-full text-sm ${
                  tag === tagItem ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tagItem}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No blogs found</h3>
              <p className="text-gray-500">
                {tag ? `No blogs found with tag: ${tag}` : 'No blogs have been published yet.'}
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center">
              {page > 1 && (
                <Link
                  href={`/blogs?page=${page - 1}${tag ? `&tag=${tag}` : ''}`}
                  className="px-3 py-1 mx-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Previous
                </Link>
              )}
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blogs?page=${pageNum}${tag ? `&tag=${tag}` : ''}`}
                  className={`px-3 py-1 mx-1 rounded ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
              
              {page < pagination.pages && (
                <Link
                  href={`/blogs?page=${page + 1}${tag ? `&tag=${tag}` : ''}`}
                  className="px-3 py-1 mx-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Next
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 