import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { User } from '@/types';
import UserModel from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID || '',
      clientSecret: process.env.LINKEDIN_SECRET || '',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await UserModel.findOne({ email: session.user.email });
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            role: dbUser?.role || 'user',
            editorRequest: dbUser?.editorRequest || false,
            authProviders: dbUser?.authProviders || [],
          },
        };
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!account) return false;
      
      try {
        const existingUser = await UserModel.findOne({ email: user.email });
        
        if (existingUser) {
          // Update auth providers if not already present
          if (!existingUser.authProviders.includes(account.provider)) {
            await UserModel.findByIdAndUpdate(existingUser._id, {
              $push: { authProviders: account.provider }
            });
          }
        } else {
          // Create new user
          await UserModel.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'user',
            editorRequest: false,
            authProviders: [account.provider],
          });
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const { auth } = NextAuth(authOptions);
export { auth }; 