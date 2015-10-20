// Constructor
var DriveDummy = function (kernel) {
  this.kernel = kernel;

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
    this.kernel.data.steering = 0;
    this.kernel.data.throttle = 0;
  }
}

module.exports = DriveDummy;
