// Constructor
var WebServer = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        stop: stop
    };

    /**
     * Start the web server
     *
     * @returns {start}
     */
    function start() {
        var express = require('express');
        var app = express();
        var server = require('http').Server(app);
        var io = require('socket.io')(server);
        var path = require('path');

        app.get('/', function (req, res) {
            res.send({
                config: _self.kernel.config,
                data: _self.kernel.data
            })
        });

        app.get('/index.html', function (req, res) {
            res.sendFile(path.resolve('webclient/index.html'));
        });

        app.use(express.static(path.resolve('webclient')));

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "localhost:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        io.on('connection', function (socket) {
            socket.emit('data', { kernel: _self.kernel.data });

            socket.on('data', function (data) {
                socket.emit('data', { kernel: _self.kernel.data });
            }).on('latency', function (startTime, cb) {
                cb(startTime);
            });
            Object.observe(_self.kernel.data, function () {
                socket.emit('data', { kernel: _self.kernel.data });
            })
        });

        _self.server = server.listen(_self.kernel.config.web_port, function () {
            var host = _self.server.address().address;
            var port = _self.server.address().port;

            console.log('Invenavi listening at http://%s:%s', host, port);
        });

        return this;
    }

    /**
     * Stop the web serverWebServer
     *
     * @returns {stop}
     */
    function stop() {
        _self.server.close();
        console.log('Webserver closed');

        return this;
    }
};

module.exports = WebServer;
