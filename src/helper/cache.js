// 缓存

const {cache} = require('../config/defaultConfig.js');

function refreshRes(stats, res) {
    const {cacheControl, expires, maxAge, lastModified, etag} = cache;

    if (expires) {
        res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
    }
    if (cacheControl) {
        res.setHeader('Cache-Control', `puplic, max-age=${maxAge}`);
    }
    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }
    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);

    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
        return;
    }

    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return;
    }

    if (etag && etag !== res.getHeader('ETag')) {
        return;
    }

    return true;
}