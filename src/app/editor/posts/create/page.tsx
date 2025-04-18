import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import MarkdownEditor from '@/components/MarkdownEditor';
import Topic from '@/models/Topic';
import Post from '@/models/Post';

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'editor') {
    redirect('/');
  }

  await connectDB();
  const topics = await Topic.find().select('name slug').lean();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Create New Post</h1>

      <form
        action={async (formData) => {
          'use server';
          
          const title = formData.get('title') as string;
          const content = formData.get('content') as string;
          const selectedTopics = formData.getAll('topics') as string[];
          const isEditorsPick = formData.get('isEditorsPick') === 'on';

          await connectDB();
          
          // Create new topics if they don't exist
          const topicIds = await Promise.all(
            selectedTopics.map(async (topicName) => {
              let topic = await Topic.findOne({ name: topicName });
              if (!topic) {
                topic = await Topic.create({
                  name: topicName,
                  createdBy: session.user.id,
                });
              }
              return topic._id;
            })
          );

          // Create the post
          await Post.create({
            title,
            content,
            topics: topicIds,
            author: session.user.id,
            isEditorsPick,
          });

          redirect('/editor/posts');
        }}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="topics">Topics</label>
              <Combobox
                id="topics"
                name="topics"
                options={topics.map((topic) => ({
                  value: topic.name,
                  label: topic.name,
                }))}
                placeholder="Select or create topics"
                creatable
                multiple
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content">Content</label>
              <MarkdownEditor
                name="content"
                required
                className="min-h-[500px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isEditorsPick"
                name="isEditorsPick"
                className="rounded"
              />
              <label htmlFor="isEditorsPick">Mark as Editor's Pick</label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Create Post</Button>
        </div>
      </form>
    </div>
  );
} 