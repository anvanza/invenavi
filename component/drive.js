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
        var I2C = require("i2c");
        var Pca9685Driver = require("pca9685");

        _self.pwm = new Pca9685Driver({
            i2c: new I2C(0x40, {device: "/dev/i2c-1"}),
            frequency: 50,
            debug: false
        }, function () {
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
