import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

async function approveRequest(userId: string) {
  'use server';
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    role: 'editor',
    editorRequest: false,
  });
  revalidatePath('/editor/requests');
}

async function rejectRequest(userId: string) {
  'use server';
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    editorRequest: false,
  });
  revalidatePath('/editor/requests');
}

export default async function EditorRequestsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'editor') {
    redirect('/');
  }

  await connectDB();
  const requests = await User.find({ editorRequest: true, role: 'user' });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Editor Access Requests</h1>
      
      <div className="grid gap-4">
        {requests.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <form action={approveRequest.bind(null, user._id.toString())}>
                  <Button type="submit" variant="default">
                    Approve
                  </Button>
                </form>
                <form action={rejectRequest.bind(null, user._id.toString())}>
                  <Button type="submit" variant="destructive">
                    Reject
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 