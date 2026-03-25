/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static page generation for auth pages
  experimental: {
    // This ensures pages with Firebase are rendered on client side
  },
}

module.exports = nextConfig
