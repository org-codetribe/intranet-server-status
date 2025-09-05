/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // makes sure it uses Pages Router, not App Router
  },
};

export default nextConfig;
