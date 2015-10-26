// Constructor
var Gps = function (kernel) {
  this.kernel = kernel;

  this.start = function(level) {
    console.log("Starting GPS");
    var gpsy = rootRequire("./gpsy");
    var gps = gpsy("/dev/ttyAMA0", 9600); // your serial device

    gps.on("position", function(data){
      this.kernel.data.gps_lat = data.lat;
      this.kernel.data.gps_lon = data.lon;
    }.bind(this));

    gps.on("speed", function(data){
      this.kernel.data.gps_speed = data.speed;
    }.bind(this));

    gps.on("altitude", function(data){
      this.kernel.data.gps_alt = data.alt;
    }.bind(this));

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
