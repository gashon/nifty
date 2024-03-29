const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

module.exports = /* withBundleAnalyzer */ {
  transpileModules: [
    '@nifty/api',
    '@nifty/ui',
    '@nifty/common',
    '@nifty/server-lib',
    '@nivty/api-live',
  ],
  reactStrictMode: true,
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
