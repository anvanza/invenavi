// Constructor
var DriveDummy = function (kernel) {
  this.kernel = kernel;

  this.start = function() {
    console.log("Dummy drive started");

    return this;
  }

  this.setThrottle = function(level) {
    console.log("Set throttle to " +  level);
    this.kernel.data.throttle = level;
  }

  this.setSteering= function(angle) {
    console.log("Set steering angle to " +  angle);
    this.kernel.data.steering = angle;
  }

  this.halt = function () {
    console.log("Halting drive controller");
  }
}

module.exports = DriveDummy;
