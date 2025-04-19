import { redirect } from 'next/navigation';

export default function BlogRedirectPage({ params }: { params: { slug: string } }) {
  redirect(`/admin/blogs/${params.slug}/edit`);
} 