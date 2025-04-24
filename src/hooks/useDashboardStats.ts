import { useState, useEffect } from 'react';

export interface RecentBlog {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
}

export interface RecentComment {
  _id: string;
  content: string;
  name: string;
  approved: boolean;
  createdAt: string;
  blog: {
    title: string;
    slug: string;
  };
}

export interface DashboardStats {
  totalBlogs: number;
  featuredBlogs: number;
  totalComments: number;
  pendingComments: number;
  tagsCount: number;
  recentBlogs: RecentBlog[];
  recentComments: RecentComment[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard stats');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return { stats, loading, error };
};