// Constructor
var Drive = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        setThrottle: setThrottle,
        setSteering: setSteering,
        halt: halt
    };

    /**
     * Starts the driver
     *
     * @returns {start}
     */
    function start() {
        var i2cBus = require("i2c-bus");
        var Pca9685Driver = require("pca9685").Pca9685Driver;

        var options = {
            i2c: i2cBus.openSync(1),
            address: 0x40,
            frequency: 50,
            debug: false
        };

        _self.pwm = new Pca9685Driver(options, function () {
            console.log("Driver initialised");
        });

        return this;
    }

    /**
     * Set the throttle
     *
     * @param throttle
     * @returns {setThrottle}
     */
    function setThrottle(throttle) {
        _self.kernel.data.throttle = throttle;

        return this;
    }

    /**
     * Set the steering
     *
     * @param steering
     * @returns {setSteering}
     */
    function setSteering(steering) {
        _self.pwm.setPulseLength(0, steering);
        _self.kernel.data.steering = steering;

        return this;
    }

    /**
     * Stop all pwm devices
     *
     * @returns {halt}
     */
    function halt() {
        _self.pwm.allChannelsOff();
        _self.pwn = null;

        return this;
    }
};

module.exports = Drive;
