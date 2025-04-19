import { notFound } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import dbConnect from '@/lib/mongoose';
import Blog from '@/models/Blog';
import { getMarkdownBySlug } from '@/lib/markdown';

async function getBlogForEdit(slug: string) {
  await dbConnect();
  
  const blog = await Blog.findOne({ slug }).lean();
  
  if (!blog) {
    return null;
  }
  
  const markdownContent = await getMarkdownBySlug(slug);
  
  if (!markdownContent) {
    return null;
  }
  
  return {
    ...JSON.parse(JSON.stringify(blog)),
    content: markdownContent.content
  };
}

export default async function EditBlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogForEdit(params.slug);
  
  if (!blog) {
    notFound();
  }
  
  return (
    <div>
      <BlogEditor mode="edit" initialData={blog} />
    </div>
  );
} 