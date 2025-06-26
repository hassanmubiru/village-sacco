/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
  // Optimize performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analyzer
  images: {
    unoptimized: false,
  },
  webpack: (config, { isServer, dev }) => {
    // Fix for viem and wagmi
    config.externals = config.externals || [];
    
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }

    // Handle missing modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Add module resolution for viem
    config.resolve.alias = {
      ...config.resolve.alias,
      'viem/_cjs/actions/public/simulateContract.js': 'viem/actions',
      'viem/_cjs': 'viem',
    };

    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/viem/ },
      { module: /node_modules\/@safe-global/ },
    ];

    // Optimize chunks for better loading
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000,
            },
            blockchain: {
              test: /[\\/]node_modules[\\/](viem|wagmi|@privy-io|thirdweb|@coinbase)[\\/]/,
              name: 'blockchain',
              chunks: 'all',
              priority: 10,
              maxSize: 244000,
            },
          },
        },
      };
    }

    return config;
  },
  // Suppress hydration warnings during development
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
