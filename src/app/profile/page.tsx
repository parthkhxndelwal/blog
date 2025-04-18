import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Google, Linkedin } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center space-x-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || 'Profile'}
            className="w-20 h-20 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{session.user.name}</h1>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Google className="w-5 h-5" />
              <span>Google</span>
            </div>
            <Button
              variant={user.authProviders.includes('google') ? 'default' : 'outline'}
              disabled={user.authProviders.includes('google')}
            >
              {user.authProviders.includes('google') ? 'Connected' : 'Connect'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </div>
            <Button
              variant={user.authProviders.includes('linkedin') ? 'default' : 'outline'}
              disabled={user.authProviders.includes('linkedin')}
            >
              {user.authProviders.includes('linkedin') ? 'Connected' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {user.role === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle>Editor Access</CardTitle>
          </CardHeader>
          <CardContent>
            {user.editorRequest ? (
              <p className="text-muted-foreground">
                Your request for editor access is pending review.
              </p>
            ) : (
              <Button onClick={() => {
                // TODO: Implement editor request functionality
              }}>
                Request Editor Access
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 