const GPS = require('gps');
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

console.log("Starting GPS");
var port = new SerialPort('/dev/serial0', {
    baudRate: 9600
}, function () {
    console.log("Started GPS");
});

const parser = new parsers.Readline();

port.pipe(parser);

const gps = new GPS;

//retrieve data from the port
parser.on('data', function(data) {
    gps.update(data);
});

//retrieve data from the gps
gps.on('data', function(data) {
    console.log(gps);
    console.log(gps.state);
    console.log(gps.state.alt);
});
