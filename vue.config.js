// 微信小程序开发配置
module.exports = {
  // 禁用性能提示
  performance: {
    hints: false
  },
  // 开发服务器配置
  devServer: {
    port: 8080,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'https://example.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // 生产环境配置
  productionSourceMap: false,
  configureWebpack: {
    // 允许本地请求
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false
  },
  // 微信小程序特有配置
  chainWebpack: config => {
    // 移除日志
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })
    }
  }
}
