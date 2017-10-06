module.exports = {
    root: process.cwd(),
    port: '3030',
    hostname: '127.0.0.1',
    compress: /\.(css|js|html|md)/,
    cache: {
        maxAge: 600,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
}