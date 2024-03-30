const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

module.exports = /* withBundleAnalyzer */ {
  transpilePackages: [
    '@nifty/api',
    '@nifty/ui',
    '@nifty/common',
    '@nifty/api-live',
  ],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };
    return config;
  },

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
