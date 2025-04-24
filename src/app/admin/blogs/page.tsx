'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaStar } from 'react-icons/fa';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <FaPlus className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'featured' ? 'default' : 'outline'}
                  onClick={() => setFilter('featured')}
                >
                  Featured
                </Button>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    <TableRow>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                    </TableRow>
                  </>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {searchTerm
                        ? 'No blogs match your search'
                        : filter === 'featured'
                        ? 'No featured blogs found'
                        : 'No blogs found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>
                        <div>
                          <Link
                            href={`/admin/blogs/${blog.slug}/edit`}
                            className="font-medium hover:underline"
                          >
                            {blog.title}
                          </Link>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {blog.excerpt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {blog.featured && (
                          <Badge variant="secondary">
                            <FaStar className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={`/admin/blogs/${blog.slug}/edit`}>
                              <FaEdit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(blog._id, blog.title)}
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 