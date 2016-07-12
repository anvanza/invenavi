// Constructor
var GpsDummy = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        stop: stop
    };

    function start() {
        console.log("Starting Dummy GPS");
        _self.kernel.data.gps_lat = 51.174644;
        _self.kernel.data.gps_lon = 4.406644;
        _self.kernel.data.gps_speed = 21;
        _self.kernel.data.gps_alt = 4;
    }

    function stop() {
        console.log("Stopping Dummy GPS");
    }
};

module.exports = GpsDummy;
