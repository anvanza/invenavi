// Constructor
var Command = function (kernel) {
    var _self = this;
    _self.kernel = kernel;
    _self.stdin = process.stdin;
    _self.stdout = process.stdout;

    return {
        start: start
    };

    function start() {
        console.log('starting cli mode');
        _self.stdin.resume();
        _self.stdin.setEncoding('utf8');
        complete();

        // on any data into stdin
        _self.stdin.on('data', function (data) {
            data = data.toString().trim();

            if (data == 'help') {
                help();
            } else if (data == 'start') {
                startComponents();
            } else if (data == 'stop') {
                stopComponents();
            } else if (data == 'startweb') {
                startWebServer();
            } else if (data == 'stopweb') {
                stopWebServer();
            } else if (data == 'steering') {
                steering();
            } else if (data == 'throttle') {
                throttle();
            } else if (data == 'update') {
                update();
            } else if (data == 'picture') {
                picture();
            } else if (data == 'config') {
                config();
            } else if (data == 'data') {
                dumpData();
            } else if (data == 'halt') {
                halt();
            } else if (data == '\u0003' || data == 'quit' || data == 'exit') {
                exit();
            } else {
                complete();
            }

        });

        return _self;
    }

    function complete() {
        _self.stdout.write('invenavi$ ');
    }

    function help() {
        console.log("-------------------|>---------------");
        console.log("-------------------|----------------");
        console.log("~~~~~~~~~~~~\\INVENAVI/~~~~~~~~~~~~~~");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("update     : reads all the sensors");
        console.log("config     : dump config");
        console.log("data       : dump data");
        console.log("reset      : reset all engines and servo's");
        console.log("start      : start all sensors");
        console.log("stop       : stop all sensors");
        console.log("throttle   : set motor");
        console.log("steering   : set servo angle");
        console.log("add point  : add waypoint for nav");
        console.log("enablenav  : enable navigation");
        console.log("disablenav : disable navigation");
        console.log("picture    : take a picture");
        console.log("startweb   : Start the webserver");
        console.log("stopweb    : Stop the webserver");
        console.log("____________________________________");
        console.log("to exit press ctrl+c or exit or quit");

        complete();
    }

    function startWebServer() {
        _self.kernel.startWebServer();

        complete();
    }

    function stopWebServer() {
        _self.kernel.stopWebServer();

        complete();
    }

    function update() {
        console.log('updating all sensors');
        _self.kernel.update();
        for (kv in _self.kernel.data) {
            console.log(kv + " = " + _self.kernel.data[kv]);
        }

        complete();
    }

    function config() {
        for (kv in _self.kernel.config) {
            console.log(kv + " = " + _self.kernel.config[kv]);
        }

        complete();
    }

    function dumpData() {
        for (kv in _self.kernel.data) {
            console.log(kv + " = " + _self.kernel.data[kv]);
        }

        complete();
    }

    function startComponents() {
        _self.kernel.startComponents();

        complete();
    }

    function stopComponents() {
        _self.kernel.stopComponents();

        complete();
    }

    function throttle(level) {
        ask("Throttle level -100 to 100: ", function (data) {
            if (_self.kernel.components.drive === false) {
                console.log("driver is not initialized yet");

                return complete();
            }

            _self.kernel.components.drive.setThrottle(data);

            complete();
        });
    }

    function steering(angle) {
        ask("Steering angle -100 to 100: ", function (data) {
            if (_self.kernel.components.drive != false) {
                _self.kernel.components.drive.setSteering(data);
            } else {
                console.log("driver is not initialized yet");
            }

            complete();
        });
    }

    function picture() {
        if (_self.kernel.components.camera === false) {
            console.log("Camera is not initialized yet");
            return complete();
        }

        _self.kernel.components.camera.take();
        complete();
    }

    function exit() {
        console.log('exiting program');
        process.exit();
    }

    function ask(question, callback) {
        _self.stdout.write(question + ": ");
        _self.stdin.once('data', function (data) {
            data = data.toString().trim();
            callback(data);
        });
    }
};

module.exports = Command;
