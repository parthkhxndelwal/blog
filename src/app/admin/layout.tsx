'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ListTodo, 
  PenLine, 
  MessageSquare,
  ExternalLink,
  Menu
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={cn("w-full justify-start gap-2", isActive && "bg-muted")}
    >
      <Link href={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const mainNavItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/admin/blogs", label: "All Blogs", icon: <ListTodo className="h-4 w-4" /> },
    { href: "/admin/blogs/new", label: "Create Blog", icon: <PenLine className="h-4 w-4" /> },
    { href: "/admin/comments", label: "Comments", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* Mobile Nav */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 px-0 pt-0">
            <div className="space-y-1 p-4">
              <div className="flex h-10 items-center gap-2 font-semibold">
                <LayoutDashboard className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </div>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="px-2 py-2">
                <nav className="space-y-1 px-2">
                  {mainNavItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      isActive={isActive(item.href)}
                    />
                  ))}
                  <Separator className="my-2" />
                  <NavItem
                href="/" 
                    label="View Blog"
                    icon={<ExternalLink className="h-4 w-4" />}
                  />
                </nav>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Admin Dashboard</span>
          <nav className="flex items-center gap-2">
            {mainNavItems.map((item, index) => (
              <Button
                key={index}
                asChild
                variant="ghost"
                size="icon"
                className={cn(isActive(item.href) && "bg-muted")}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
              </Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <nav className="hidden w-64 flex-col border-r bg-background px-3 py-4 md:flex">
          <div className="flex h-10 items-center gap-2 font-semibold">
            <LayoutDashboard className="h-5 w-5" />
            <span>Admin Dashboard</span>
            </div>
          <Separator className="my-4" />
          <div className="flex-1">
            <nav className="grid gap-1 px-2 py-2">
              {mainNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive(item.href)}
                />
              ))}
            </nav>
            </div>
          <Separator className="my-4" />
          <div className="px-2">
            <NavItem
              href="/"
              label="View Blog"
              icon={<ExternalLink className="h-4 w-4" />}
            />
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
      </div>
    </div>
  );
} 