/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/test-001',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
