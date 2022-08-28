module.exports = {
    devServer: {
        open: true,
        port: 8088,
        proxy: {
            '/api': {
                target: 'http://localhost:8888',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
}
