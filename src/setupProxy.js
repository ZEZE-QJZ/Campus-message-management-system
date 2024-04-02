const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    //新版是proxy.createProxyMiddleware
    proxy.createProxyMiddleware(
        '/api',
        {
            target: 'https://i.maoyan.com',
            changeOrigin: true,
        }
      )
    )
};