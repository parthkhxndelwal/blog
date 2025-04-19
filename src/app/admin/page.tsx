'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import format from 'date-fns/format';
import { 
  LayoutDashboard, 
  ListTodo, 
  PenLine, 
  MessageSquare,
  TrendingUp,
  Tag,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardStats {
  totalBlogs: number;
  featuredBlogs: number;
  totalComments: number;
  pendingComments: number;
  tagsCount: number;
  recentBlogs: any[];
  recentComments: any[];
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent className="py-0">
        <Skeleton className="h-10 w-20 my-1" />
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-6 w-full" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-6 w-8 ml-auto" /></TableCell>
    </TableRow>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refreshData = () => {
    setLoading(true);
    router.refresh();
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your blog performance and recent activity
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Blogs
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{stats?.totalBlogs || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link href="/admin/blogs">
                    View all blogs <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Featured Blogs
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">{stats?.featuredBlogs || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link href="/admin/blogs?featured=true">
                    View featured <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{stats?.totalComments || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link href="/admin/comments">
                    View all <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold">{stats?.pendingComments || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link href="/admin/comments?status=pending">
                    Review now <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
      
      <Tabs defaultValue="blogs" className="mt-8">
        <TabsList>
          <TabsTrigger value="blogs">Recent Blogs</TabsTrigger>
          <TabsTrigger value="comments">Recent Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogs" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>The latest blogs published on your site</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : stats?.recentBlogs?.length ? (
                    stats.recentBlogs.map((blog: any) => (
                      <TableRow key={blog._id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/blogs/${blog.slug}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No blogs published yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t bg-muted/40 px-6 py-4">
              <Button asChild variant="outline" className="gap-1">
                <Link href="/admin/blogs/new">
                  <PenLine className="h-4 w-4" />
                  Create new blog
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
              <CardDescription>Latest comments on your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comment</TableHead>
                    <TableHead>Blog</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : stats?.recentComments?.length ? (
                    stats.recentComments.map((comment: any) => (
                      <TableRow key={comment._id}>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{comment.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="font-medium leading-none">{comment.name || 'Anonymous'}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{comment.content}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/blogs/${comment.blog?.slug}`} className="text-sm hover:underline">
                            {comment.blog?.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={comment.approved ? "default" : "outline"}>
                            {comment.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No comments yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t bg-muted/40 px-6 py-4">
              <Button asChild variant="outline">
                <Link href="/admin/comments">
                  View all comments
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 