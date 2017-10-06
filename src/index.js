const yargs = require('yargs');
const Server = require('./app.js');

const argv = yargs
    .usage('anywhere [options]')
    .option('p', {
        alias: 'port', // 别名
        describe: '端口号',
        default: 3030
    })
    .option('h', {
        alias: 'hostname', // 别名
        describe: 'host',
        default: '127.0.0.1'
    })
    .option('d', {
        alias: 'root', // 别名
        describe: 'root path',
        default: process.cwd()
    })
    .version()
    .alias('v', 'version')
    .help()
    .argv;

    const server = new Server(argv);
    server.start();