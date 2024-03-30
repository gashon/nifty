const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

// nextConfig.transpilePackages doesn't work with pnpm
const withTM = require('next-transpile-modules')([
  '@nifty/api',
  '@nifty/ui',
  '@nifty/common',
  '@nifty/api-live',
]);

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  swcMinify: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    const HOST = process.env.API_BASE_URL;
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

module.exports = withTM(withBundleAnalyzer(nextConfig));
