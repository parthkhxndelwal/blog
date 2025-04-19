'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Settings, 
  X, 
  Info, 
  Check, 
  Plus, 
  Minus, 
  Search,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function ComponentShowcase() {
  const [date, setDate] = useState<Date>();
  const [progress, setProgress] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Simulate progress bar animation
  useState(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 500);
    return () => clearTimeout(timer);
  });
  
  // Data for samples
  const tags = ["Design", "UI", "Frontend", "Backend", "API", "Database", "React", "Next.js"];
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    }
  ];
  
  return (
    <div className="space-y-12 pb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Shadcn UI Component Showcase</h1>
        <p className="text-muted-foreground">This page demonstrates all the Shadcn UI components integrated into our blog application.</p>
      </div>
      
      <Separator />
      
      {/* Alert and Alert Dialog */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Alerts & Notifications</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Alert</h3>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert for the blog application.
              </AlertDescription>
            </Alert>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Alert Dialog</h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Post</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the blog post and remove the data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Toast</h3>
            <Button
              onClick={() => {
                toast({
                  title: "Blog Post Published",
                  description: "Your blog post has been successfully published.",
                });
              }}
            >
              Show Toast Notification
            </Button>
            <Toaster />
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Dialog, Sheet and Hover Card */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Dialogs & Popovers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="@username" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Sheet (Sidebar)</h3>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Settings</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Blog Settings</SheetTitle>
                  <SheetDescription>
                    Adjust your blog preferences here.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blog-name">Blog Name</Label>
                    <Input id="blog-name" placeholder="My Awesome Blog" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="A blog about..." />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Hover Card</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="p-0">@johndoe</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@johndoe</h4>
                    <p className="text-sm">
                      John Doe is a prolific writer with over 50 published articles on technology and design.
                    </p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        Joined December 2023
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Popover</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Share Post</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Share this post</h4>
                  <p className="text-sm text-muted-foreground">
                    Share this post with your friends and followers
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="w-full">Twitter</Button>
                    <Button size="sm" className="w-full">Facebook</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Table and Calendar */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Data Display</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Table</h3>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell>{invoice.invoice}</TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Calendar</h3>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Schedule post</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Form Controls */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Form Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Selects</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Radio Group</h3>
              <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">Draft</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Switch</h3>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" checked={isSubscribed} onCheckedChange={setIsSubscribed} />
                <Label htmlFor="notifications">
                  {isSubscribed ? 'Unsubscribe from newsletter' : 'Subscribe to newsletter'}
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Progress</h3>
              <Progress value={progress} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Skeleton Loading</h3>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Toggle</h3>
              <div className="flex flex-wrap gap-2">
                <Toggle aria-label="Toggle bold">
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle aria-label="Toggle italic">
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle aria-label="Toggle underline">
                  <Underline className="h-4 w-4" />
                </Toggle>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Tooltip */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Tooltips</h2>
        
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new blog post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search blog posts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
      
      <Separator />
      
      {/* Tabs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Tabs</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>View all your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have 12 blog posts in total.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="published" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
                <CardDescription>View your published blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have 8 published blog posts.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="drafts" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft Posts</CardTitle>
                <CardDescription>View your draft blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have 4 draft blog posts.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      
      <Separator />
      
      {/* Scroll Area */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Scroll Area</h2>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Tags Scroll Area</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium">Available Tags</h4>
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="mt-2 rounded-md border p-2">
                  Tag {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </section>
      
      <div className="fixed bottom-4 right-4">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
} 