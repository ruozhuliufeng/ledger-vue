module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {
                target: 'https://www.tally.aixuxi.cn',
                // target: 'http://localhost:8888',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
}
