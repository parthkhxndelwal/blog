import mongoose, { Schema, Document } from 'mongoose';
import { User, Topic } from '@/types';

export interface Post extends Document {
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

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    topics: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    }],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isEditorsPick: {
      type: Boolean,
      default: false,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Create text indexes for search functionality
PostSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Post || mongoose.model<Post>('Post', PostSchema); 