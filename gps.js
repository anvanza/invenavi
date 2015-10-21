// Constructor
var Gps = function (kernel) {
  this.kernel = kernel;

  this.start = function(level) {
    console.log("Starting GPS");
    var gpsy = require("gpsy");
    var gps = gpsy("/dev/ttyAMA0"); // your serial device

    gps.on("fix", console.log);
    gps.on("position", console.log);
    gps.on("speed", console.log);
    gps.on("time", console.log);
  }
}

module.exports = Gps;
