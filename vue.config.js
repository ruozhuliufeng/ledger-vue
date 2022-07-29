module.exports = {
    devServer: {
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/': {
                target: 'http://localhost:8888',
                changeOrigin: true,
            }
        }
    }
}
