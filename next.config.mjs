/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const bffUrl = process.env.BFF_BASE_URL ?? 'http://localhost:8080';
    return [
      {
        source: '/api/bff/:path*',
        destination: `${bffUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
