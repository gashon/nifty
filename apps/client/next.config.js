module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: [
      '@nifty/tsconfig',
      '@nifty/server-lib',
      '@nifty/ui',
      '@nifty/common',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    const HOST = 'http://host.docker.internal:3001' || process.env.API_BASE_URL;
    return [
      {
        source: '/ajax/:path*',
        destination: `${HOST}/ajax/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${HOST}/:path*`,
      },
    ];
  },
};
