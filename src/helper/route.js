const fs = require('fs');
const path = require('path');
const mime = require('./mime.js')
const Handlebars = require('handlebars');  // 模板引擎
// const config = require('../config/defaultConfig.js');
// 引入 promise
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// 压缩
const compress = require('./compress.js');
// 范围
const range = require('./range.js');
// 缓存
const isFresh = require('./cache.js');

const tplPath = path.join(__dirname, '../template/dir.tpl'); // 拼接 url
const source = fs.readFileSync(tplPath); // 读取文件内容
const template = Handlebars.compile(source.toString()); // 使用 Handlebars 生成模板

module.exports = async function (req, res, filePath, config) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) { // 是文件则通过 stream 流的形式读取出来
            const contentType = mime(filePath);
            res.setHeader('Content-Type', contentType);

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }

            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start, end});
            }
            if (filePath.match(config.compress)) { // 满足条件才进行压缩
                rs = compress(rs, req, res);
            }
            rs.pipe(res);

        } else if (stats.isDirectory()) { // 是文件夹的话则将文件夹内的文件名打印出来
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            }
            res.end(template(data));
        }
    } catch (error) {
        res.statusCode = '404';
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file ${error}`);
    }
}