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

        _self.pwm = new Pca9685Driver(options, function (data) {
            console.log(data);
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

        throttle = (throttle*5)+1500;

        if (throttle > 2000) {
            throttle = 2000
        }

        if (throttle < 1000) {
            throttle = 1000
        }

        _self.pwm.setPulseLength(1, throttle, 0, function () {
            console.log("Throttle set to " +  throttle + " microseconds in pulse length");
        });
        _self.kernel.data.throttle = (throttle/5)-1500;

        return this;
    }

    /**
     * Set the steering
     *
     * @param steering
     * @returns {setSteering}
     */
    function setSteering(steering) {
        //should be pulselength between 800 and 2300

        _self.pwm.setPulseLength(0, steering, 0, function () {
            console.log("Steering set to " +  steering);
        });
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
        _self.kernel.data.steering = 0;
        _self.kernel.data.throttle = 0;
        _self.pwn = null;

        return this;
    }
};

module.exports = Drive;
