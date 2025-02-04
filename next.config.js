/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/privy/:path*',
        destination: 'https://auth.privy.io/api/:path*',
      },
    ];
  },
  images: {
    domains: ['auth.privy.io'],
  },
};

module.exports = nextConfig; 