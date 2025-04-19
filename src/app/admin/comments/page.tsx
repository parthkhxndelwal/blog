'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

interface Comment {
  _id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  blog: {
    _id: string;
    title: string;
    slug: string;
  };
}

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/comments/admin' 
        : `/api/comments/admin?status=${filter}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/admin/${id}/approve`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve comment');
      }
      
      // Update the local state
      setComments(comments.map(comment => 
        comment._id === id ? { ...comment, approved: true } : comment
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error approving comment:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/admin/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // Remove from local state
      setComments(comments.filter(comment => comment._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Comments</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All ({comments.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Pending ({comments.filter(c => !c.approved).length})
          </button>
          <button 
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${filter === 'approved' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Approved ({comments.filter(c => c.approved).length})
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-600">No comments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{comment.name}</div>
                    <div className="text-sm text-gray-500">{comment.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">{comment.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/blogs/${comment.blog?.slug || '#'}`} className="text-blue-600 hover:underline">
                      {comment.blog?.title || 'Unknown Blog'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      comment.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!comment.approved && (
                        <button 
                          onClick={() => handleApprove(comment._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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
    </div>
  );
} 