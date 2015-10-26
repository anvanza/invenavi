// Constructor
var Camera = function (kernel) {
  this.kernel = kernel;
  var FileHelper = rootRequire("./helper/file");
  var filehelper = new FileHelper();

  this.start = function() {
    var RaspiCam = require("raspicam");
    this.camera = new RaspiCam({
      mode: 'photo',
      output: './pictures/process.jpg',
      timeout: 100,
      quality: 100
    });

    console.log("Camera started");

    return this;
  }

  this.take = function(callback) {
    this.camera.start();
    var newfilename = "./pictures/" + Date.now() + ".jpg";

    //listen for the "read" event triggered when each new photo/video is saved
    this.camera.on("read", function(err, timestamp, filename){
      filehelper.move("./pictures/process.jpg", newfilename, function() {
        callback(newfilename);
      });
    });
  }
}

module.exports = Camera;
