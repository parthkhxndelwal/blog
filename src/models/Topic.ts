import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@/types';

export interface Topic extends Document {
  name: string;
  slug: string;
  description?: string;
  createdBy: User;
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<Topic>(
  {
    name: {
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
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }],
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
TopicSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Topic || mongoose.model<Topic>('Topic', TopicSchema); 