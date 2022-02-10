const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpackConfigProd = require('react-scripts/config/webpack.config')(
  'production'
)

// pushing BundleAnalyzerPlugin to plugins array
new BundleAnalyzerPlugin()
