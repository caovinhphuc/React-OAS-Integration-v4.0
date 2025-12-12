const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      ws: true,
      changeOrigin: true,
    }),
  )
}
