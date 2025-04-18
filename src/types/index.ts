import { DefaultSession } from 'next-auth';

export type UserRole = 'user' | 'editor';

export interface User extends DefaultSession['user'] {
  id: string;
  role: UserRole;
  editorRequest: boolean;
  authProviders: string[];
  name?: string;
  email?: string;
  image?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  topics: Topic[];
  author: User;
  isEditorsPick: boolean;
  likes: User[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  posts: Post[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  user: User;
  content: string;
  createdAt: Date;
}

declare module 'next-auth' {
  interface Session {
    user: User;
  }
} 