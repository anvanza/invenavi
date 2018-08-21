const GPS = require('gps');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var Gps = function (kernel) {
    var _self = this;
    _self.kernel = kernel;
    _self.port = false;

    return {
        start: start,
        stop: stop
    };

    /**
     * Start the GPS
     *
     * @returns {start}
     */
    function start() {
        console.log("Starting GPS");
        _self.port = new SerialPort('/dev/ttyAMA0', {
            baudRate: 9600
        }, function () {
            console.log("Started GPS");
        });
        const parser = _self.port.pipe(new Readline({ delimiter: '\r\n' }));
        const gps = new GPS;

        //retrieve data from the port
        parser.on('data', function(data) {
            gps.update(data);
        });

        //retrieve data from the gps
        gps.on('data', function(data) {
            console.log(data, gps.state);
            _self.kernel.data.gps_lat = gps.state.lat;
            _self.kernel.data.gps_lon = gps.state.lon;
            _self.kernel.data.gps_speed = gps.state.speed;
            _self.kernel.data.gps_alt = gps.state.alt;
        });

        return this;
    }

    function stop() {
        if (_self.port === false) {
            console.log("port not open");
        }

        _self.port.close(function () {
            console.log("gps closed");
        });
    }
};

module.exports = Gps;
