/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PIXLR_CLIENT_KEY: process.env.PIXLR_CLIENT_KEY,
    PIXLR_CLIENT_SECRET: process.env.PIXLR_CLIENT_SECRET,
  },
}

module.exports = nextConfig