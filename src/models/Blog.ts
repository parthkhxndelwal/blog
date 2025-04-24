import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  images: string[];
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  likes: number;
  comments: mongoose.Types.ObjectId[];
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String, default: '' },
  images: [{ type: String }],
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

// Ensure model is not redefined during hot reloading
const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog; 