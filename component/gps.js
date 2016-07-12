// Constructor
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
        var SerialPort = require('serialport');
        _self.port = new SerialPort.SerialPort('/dev/ttyAMA0', {
            baudrate: 9600,
            parser: SerialPort.parsers.readline('\r\n')
        });

        var GPS = require('gps');
        var gps = new GPS;

        //retrieve data from the gps
        gps.on('data', function(data) {
            console.log(data, gps.state);
            _self.kernel.data.gps_lat = gps.state.lat;
            _self.kernel.data.gps_lon = gps.state.lon;
            _self.kernel.data.gps_speed = gps.state.speed;
            _self.kernel.data.gps_alt = gps.state.alt;
        });

        //retrieve data from the port
        _self.port.on('data', function(data) {
            gps.update(data);
        });

        return this;
    }

    function stop() {
        if (_self.port === false) {
            console.log("port not open");
        }

        _self.port.close();
    }
};

module.exports = Gps;
