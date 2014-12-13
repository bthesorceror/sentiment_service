var http = require('http');

function Server(port) {
  this.port = port;
  var handler = this.handler.bind(this);
  this._server = http.createServer(handler);
}

Server.prototype.start = function() {
  this._server.listen(this.port);
}

Server.prototype.handler = function(req, res) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify({name: "Brandon Farmer"}));
}

Server.prototype.stop = function() {
  this._server.close();
}

module.exports = Server;
