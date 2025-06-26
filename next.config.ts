/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
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

    return config;
  },
  // Suppress hydration warnings during development
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;