const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    plugins: [
      ...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
    ],
    configure: (webpackConfig) => {
      // Optimize bundle size
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              default: false,
              vendors: false,
              // Vendor chunk
              vendor: {
                name: 'vendor',
                chunks: 'all',
                test: /node_modules/,
                priority: 20,
              },
              // MUI chunk
              mui: {
                name: 'mui',
                test: /[\\/]node_modules[\\/]@mui[\\/]/,
                chunks: 'all',
                priority: 30,
              },
              // Common chunk
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
      return webpackConfig;
    },
  },
}

