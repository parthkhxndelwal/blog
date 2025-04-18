/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'media.licdn.com'],
  },
};

module.exports = withPWA(nextConfig); 