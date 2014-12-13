var Server = require('./lib/server');

var server = new Server(process.env['PORT'] || 3000);

server.start();
