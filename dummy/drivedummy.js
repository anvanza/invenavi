// Constructor
var DriveDummy = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        setThrottle: setThrottle,
        setSteering: setSteering,
        halt: halt
    };

    /**
     *
     * @returns {start}
     */
    function start() {
        console.log("Starting Dummy Drive");

        return this;
    }

    /**
     *
     * @param level
     * @returns {setThrottle}
     */
    function setThrottle(level) {
        console.log("Set throttle to " + level);
        _self.kernel.data.throttle = level;

        return this;
    }

    /**
     *
     * @param angle
     * @returns {setSteering}
     */
    function setSteering(angle) {
        console.log("Set steering angle to " + angle);
        _self.kernel.data.steering = angle;

        return this;
    }

    /**
     * 
     * @returns {halt}
     */
    function halt() {
        console.log("Halting drive controller");

        return this;
    }
};

module.exports = DriveDummy;
