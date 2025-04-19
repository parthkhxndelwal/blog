'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  likes: number;
  comments: any[];
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  
  const fetchBlogs = async (page: number, featured: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (featured) {
        queryParams.append('featured', 'true');
      }
      
      const response = await fetch(`/api/blogs?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blogs');
      }
      
      setBlogs(data.blogs);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs(currentPage, filter === 'featured');
  }, [currentPage, filter]);
  
  const handleDelete = async (blogId: string, blogTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/blogs/${blogs.find(b => b._id === blogId)?.slug}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog');
      }
      
      // Remove blog from state
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      console.error('Error deleting blog:', error);
    }
  };
  
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {filter === 'featured' ? 'Featured Blogs' : 'All Blogs'}
        </h1>
        
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          New Blog
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Blogs
              </button>
              <button
                onClick={() => setFilter('featured')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'featured'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Featured
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? 'No blogs match your search'
                : filter === 'featured'
                ? 'No featured blogs found'
                : 'No blogs found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <Link
                            href={`/admin/blogs/${blog.slug}/edit`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {blog.title}
                          </Link>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {blog.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {blog.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FaStar className="mr-1" />
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="text-blue-600 hover:text-blue-900"
                          target="_blank"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/blogs/${blog.slug}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="hidden md:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-50 text-blue-700 border-blue-500'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 