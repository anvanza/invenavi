// Constructor
var Gps = function (kernel) {
  this.kernel = kernel;

  this.start = function(level) {
    console.log("Starting GPS");
    var gpsy = require("gpsy");
    var gps = gpsy("/dev/ttyAMA0"); // your serial device

    gps.on("fix", function(ring){
      console.log(ring);
    });
    gps.on("position", function(ring){
      console.log(ring);
    });
    gps.on("speed", function(ring){
      console.log(ring);
    });
    gps.on("time",function(ring){
      console.log(ring);
    });
    gps.on("data",function(ring){
      console.log(ring);
    });
    gps.on("error",function(ring){
      console.log(ring);
    });
    gps.on("close",function(ring){
      console.log(ring);
    }):

    return this;
  }
}

module.exports = Gps;
