var http       = require("http");
var sentiment  = require("sentiment");
var formidable = require("formidable");

function json(status, contents) {
  this.writeHead(status, {
    "Content-Type": "application/json"
  });

  this.end(JSON.stringify(contents));
}

function Server(port) {
  this.port = port;
  var handler = this.handler.bind(this);
  this._server = http.createServer(handler);
}

Server.prototype.start = function() {
  this._server.listen(this.port);
}

Server.prototype._serverError = function(req, res, err) {
  res.json(500, {error: err.toString()});
}

Server.prototype._processText = function(req, res, text) {
  if (text) {
    res.json(200, {sentiment: sentiment(text)});
  } else {
    res.json(422, {error: "Must provide text to analyze."});
  }
}

Server.prototype._post = function(req, res) {
  var form = new formidable.IncomingForm();
  var self = this;

  form.parse(req, function(err, fields, files) {
    if (err) return self._serverError(req, res, err);
    self._processText(req, res, fields.text);
  });
}

Server.prototype.handler = function(req, res) {
  res.json = json.bind(res);

  var functionName = "_" + req.method.toLowerCase();
  if (this[functionName]) {
    this[functionName](req, res);
  } else {
    res.writeHead(405);
    res.end();
  }
}

Server.prototype.stop = function() {
  this._server.close();
}

module.exports = Server;
