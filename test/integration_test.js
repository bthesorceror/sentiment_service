var test = require('tape');
var hyperquest = require('hyperquest');
var Server = require('../lib/server');

test('integration test', function(t) {
  var server = new Server(9999);
  server.start();

  t.plan(3);

  var request = hyperquest.get("http://localhost:9999/");

  request.on('response', function(res) {
    t.ok(true, 'Response received');

    var content_type = res.headers["content-type"];
    t.equal(content_type, "application/json", "returns correct content-type");

    var body = "";
    res.on('data', function(data) {
      body += data.toString();
    });

    res.on('end', function() {
      t.deepEqual(
        JSON.parse(body),
        {name: "Brandon Farmer"},
        "returns correct response"
        );
    });
  });

  t.on('end', function() {
    server.stop();
  });
});
