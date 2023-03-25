module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['@nifty/tsconfig', '@nifty/server-lib', '@nifty/ui', '@nifty/common'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: '/ajax/:path*',
        destination: `${process.env.API_BASE_URL}/ajax/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL}/:path*`,
      },
    ];
  },
};
