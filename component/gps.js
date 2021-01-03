const GPS = require('gps');
const SerialPort = require('serialport');

var Gps = function (kernel) {
    var _self = this;
    _self.kernel = kernel;
    _self.port = false;
    _self.gps = false;

    return {
        start: start,
        stop: stop
    };

    /**
     * Start the GPS
     */
    function start() {
        console.log("Starting GPS");

        _self.port = new SerialPort('/dev/serial0', {
            baudRate: 9600
        }, function () {
            console.log("Started Serialport for GPS");
        }).on('error', function(err) {
            console.log('Error in serialport for GPS: ', err.message)
        }).on('close', function () {
            console.log("Serialport closed");
        })

        //create a parser and feed this to the port
        const Readline = SerialPort.parsers.Readline;
        const parser = new Readline('\r\n');
        _self.port.pipe(parser);

        _self.gps = new GPS;

        //retrieve data from the port
        parser.on('data', function(data) {
            try {
                _self.gps.update(data);
            } catch (error) {
                console.log("gps update error: " + error);
            }

        });

        //retrieve data from the gps
        _self.gps.on('data', function(data) {
            _self.kernel.data.gps_lat  = _self.gps.state.lat;
            _self.kernel.data.gps_lon  = _self.gps.state.lon;
            _self.kernel.data.gps_speed  = _self.gps.state.speed;
            _self.kernel.data.gps_alt  = _self.gps.state.alt;
            _self.kernel.data.gps_sats  = _self.gps.state.satsVisible;
        });

        return this;
    }

    function stop() {
        if (_self.port === false) {
            console.log("port not open");
        }

        _self.port.close();

        _self.gps.off('data');

        _self.port = false;
        _self.gps = false
    }
};

module.exports = Gps;
