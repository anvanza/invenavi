// Constructor
var IMUDummy = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start
    };

    function start() {
        console.log("Starting Dummy IMU");
    }
};

module.exports = IMUDummy;
