import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import Blog from '../models/Blog';

const MONGODB_URI = process.env.MONGODB_URI!;

async function migrateBlogs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all blogs
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to migrate`);

    // Update each blog
    for (const blog of blogs) {
      // If markdownPath exists, use it to set the content
      if (blog.markdownPath) {
        // Remove the markdownPath field
        await Blog.updateOne(
          { _id: blog._id },
          { $unset: { markdownPath: 1 } }
        );
        console.log(`Updated blog: ${blog.title}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateBlogs(); 