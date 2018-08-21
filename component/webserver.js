const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

var WebServer = function (kernel) {
    var _self = this;
    _self.kernel = kernel;
    _self.server = null;
    _self.intervalTimer = null;

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

        const app = express();
        const server = http.Server(app);
        const io = socketio(server);

        app.get('/data', function (req, res) {
            res.send({
                config: _self.kernel.config,
                data: _self.kernel.data
            })
        });

        app.get('/', function (req, res) {
            res.sendFile(path.resolve('webclient/index.html'));
        });

        app.use(express.static(path.resolve('webclient')));

        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "localhost:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        io.on('connection', function (socket) {
            console.log('Webserver: user connected');
            socket.emit('data', {kernel: _self.kernel.data});

            socket.on('data', function (data) {
                socket.emit('data', {kernel: _self.kernel.data});
            }).on('latency', function (startTime, cb) {
                cb(startTime);
            }).on('disconnect', function () {
                console.log('Webserver: user disconnected');
            });

            //send this as volatile since we don't really care if the data is received correctly.
            _self.intervalTimer = setInterval(function () {
                socket.volatile.emit('data', {kernel: _self.kernel.data});
            }, 500);
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
        clearInterval(_self.intervalTimer);

        if (_self.server === null) {
            console.log('webserver was not started');

            return this;
        }

        _self.server.close();
        console.log('Webserver closed');

        return this;
    }
};

module.exports = WebServer;
