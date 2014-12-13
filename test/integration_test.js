var qs         = require("querystring");
var test       = require("tape");
var hyperquest = require("hyperquest");
var Server     = require("../lib/server");

test("integration tests", function(t) {
  var server = new Server(9999);
  server.start();

  t.test("GET not allowed", function(t) {
    t.plan(1);

    var request = hyperquest.get("http://localhost:9999/");

    request.on("response", function(res) {
      t.equal(res.statusCode, 405, "returns correct status");
    });
  });

  t.test("POST with proper parameters", function(t) {
    t.plan(2);

    var formData = qs.stringify({
      text: "This is a very very bad post."
    });

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': formData.length
    };

    var request = hyperquest.post("http://localhost:9999/", {
      headers: headers
    });

    request.on("response", function(res) {
      t.equal(res.statusCode, 200, "returns correct status");

      var body = "";

      res.on('data', function(data) {
        body += data.toString();
      });

      res.on('end', function() {
        var json = JSON.parse(body);
        var expected = {
          sentiment: {
            comparative: -0.42857142857142855,
            negative: [ 'bad' ],
            positive: [],
            score: -3,
            tokens: [ 'this', 'is', 'a', 'very', 'very', 'bad', 'post' ],
            words: [ 'bad' ]
          }
        }

        t.deepEqual(json, expected, "returns the correct json");
      });
    });

    request.end(formData);
  });

  t.test("POST with no text", function(t) {
    t.plan(2);

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 0
    };

    var request = hyperquest.post("http://localhost:9999/", {
      headers: headers
    });

    request.on("response", function(res) {
      t.equal(res.statusCode, 422, "returns correct status");

      var body = "";
      res.on('data', function(data) {
        body += data.toString();
      });

      res.on('end', function() {
        var expected = {error: "Must provide text to analyze."};
        t.deepEqual(JSON.parse(body), expected, "returns correct error");
      });
    });

    request.end();
  });

  t.on("end", function() {
    server.stop();
  });
});
