# Blog Application

A modern blog application built with Next.js, TypeScript, Tailwind CSS, and MongoDB. The application allows users to view blog posts and admins to create, edit, and delete posts through a dedicated dashboard.

## Features

- **User-facing blog website:**
  - View all blog posts
  - Filter blogs by tags
  - Read individual blog posts
  - Comment on blog posts
  - Like blog posts

- **Admin dashboard:**
  - Create, edit, and delete blog posts
  - Markdown editor for content creation
  - Moderate comments
  - View statistics and analytics

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Icons
  - SimpleMDE for Markdown editing

- **Backend:**
  - Next.js API Routes
  - MongoDB with Mongoose
  - Markdown processing with gray-matter and marked

- **Data Storage:**
  - MongoDB for structured data
  - Markdown files for blog content

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your MongoDB database and add the connection string to `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and helpers
- `/src/models`: Mongoose models
- `/content/blogs`: Markdown files for blog content

## License

This project is licensed under the MIT License.
