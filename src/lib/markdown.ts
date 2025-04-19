import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { marked } from 'marked';

// Define the base directory for markdown files
const CONTENT_DIR = path.join(process.cwd(), 'content/blogs');

// Ensure the content directory exists
try {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log(`Created content directory at ${CONTENT_DIR}`);
  }
} catch (error) {
  console.error(`Error creating content directory: ${error instanceof Error ? error.message : String(error)}`);
}

export interface MarkdownContent {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    author: string;
    coverImage?: string;
    date: string;
    tags?: string[];
    featured?: boolean;
  };
  content: string;
}

export async function getMarkdownBySlug(slug: string): Promise<MarkdownContent | null> {
  const fullPath = path.join(CONTENT_DIR, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: {
      title: data.title || '',
      excerpt: data.excerpt || '',
      author: data.author || 'Anonymous',
      coverImage: data.coverImage || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      tags: data.tags || [],
      featured: data.featured || false,
    },
    content,
  };
}

export async function getAllMarkdownSlugs(): Promise<string[]> {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`Content directory does not exist: ${CONTENT_DIR}`);
    return [];
  }
  
  try {
    const fileNames = fs.readdirSync(CONTENT_DIR);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error(`Error reading content directory: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

export async function getAllMarkdownContent(): Promise<MarkdownContent[]> {
  const slugs = await getAllMarkdownSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getMarkdownBySlug(slug);
      return post;
    })
  );
  
  // Filter out any null values and sort by date
  return posts
    .filter((post): post is MarkdownContent => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function saveMarkdownContent(slug: string, data: any, content: string): Promise<void> {
  try {
    console.log(`Attempting to save markdown content for slug: ${slug}`);
    
    // Check if content directory exists and has write permissions
    if (!fs.existsSync(CONTENT_DIR)) {
      console.log(`Content directory doesn't exist, creating: ${CONTENT_DIR}`);
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    
    // Check write permissions by creating a test file
    const testFilePath = path.join(CONTENT_DIR, '.test-write-permission');
    try {
      fs.writeFileSync(testFilePath, 'test', { flag: 'w' });
      fs.unlinkSync(testFilePath); // Clean up test file
      console.log('Write permission check passed');
    } catch (error) {
      console.error(`Write permission check failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Cannot write to content directory: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    const fileContent = matter.stringify(content, data);
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    
    console.log(`Writing markdown file to: ${filePath}`);
    fs.writeFileSync(filePath, fileContent);
    console.log(`Successfully saved markdown file for: ${slug}`);
  } catch (error) {
    console.error(`Error saving markdown content: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to save markdown content: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteMarkdownContent(slug: string): Promise<boolean> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting markdown file: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

export async function serializeMarkdown(content: string) {
  return await serialize(content);
}

export function parseMarkdown(content: string) {
  return marked(content);
} 