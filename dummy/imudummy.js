// Constructor
var IMUDummy = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        stop: stop
    };

    function start() {
        console.log("Starting Dummy IMU");
    }

    function stop() {

    }
};

module.exports = IMUDummy;
