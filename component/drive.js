// Constructor
var Drive = function (kernel) {
  this.kernel = kernel;

  this.start = function() {
    var I2C = require("i2c");
    var Pca9685Driver = require("pca9685");

    this.pwm = new Pca9685Driver({
      i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
      frequency: 50,
      debug: false
    }, function() {
        console.log("Driver initialised");
    });

    return this;
  }
  this.setThrottle = function(throttle) {

    this.kernel.data.throttle = throttle;
  }
  this.setSteering = function(steering) {

    this.kernel.data.steering = steering;
  }
  this.halt = function() {
    this.pwm.allChannelsOff();
    this.pwn = null;
  }
}

module.exports = Drive;
