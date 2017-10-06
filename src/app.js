/**
 * 静态资源服务器 creatServer
 */
const http = require('http');
const path = require('path');
const chalk = require('chalk'); // 控制输出颜色
const conf = require('./config/defaultConfig.js');
const route = require('./helper/route.js');
const openUrl = require('./helper/openUrl.js');

class Server {
    constructor (config) {
        this.conf = Object.assign({}, conf, config);
    }

    start() {
        let server = http.createServer((req, res) => {
            const url = req.url;
            const filePath = path.join(this.conf.root, url);
            route(req, res, filePath, this.conf);
        });
        
        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.log(`Server started at ${chalk.green(addr)}`);
            openUrl(addr);
        });
    }
}

module.exports = Server;


