// Constructor
var Gps = function (kernel) {
  this.kernel = kernel;

  this.start = function(level) {
    console.log("Starting GPS");
    var gpsy = require("./gpsy");
    var gps = gpsy("/dev/ttyAMA0", 9600); // your serial device

    gps.on("fix", function(ring){
      console.log('fix');
      console.log(ring);
    });
    gps.on("position", function(ring){
      console.log("position");
      console.log(ring);
    });
    gps.on("speed", function(ring){
      console.log("speed");
      console.log(ring);
    });
    gps.on("time", function(ring){
      console.log("time");
      console.log(ring);
    });
    gps.on("data", function(ring){
      console.log("data");
      console.log(ring);
    });
    gps.on("err", function(ring){
      console.log("error");
      console.log(ring);
    });
    gps.on("close", function(ring){
      console.log("close");
      console.log(ring);
    });

    return this;
  }
}

module.exports = Gps;
