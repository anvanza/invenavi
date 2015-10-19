// Constructor
function Webserver(kernel) {
  // always initialize all instance properties
  this.kernel = kernel;
}
// class methods
Webserver.prototype.start = function() {
  var express = require('express');
  var app = express();

  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.post('/', function (req, res) {
    res.send('Got a POST request');
  });

  var server = app.listen(this.kernel.config.web_port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Invenavi listening at http://%s:%s', host, port);
  });
};

module.exports = Webserver;
