// Constructor
var Camera = function (kernel) {
  this.kernel = kernel;
  var copyhelper = rootRequire('./helper/move');

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

  this.take = function() {
    this.camera.start();

    var newfilename = "./pictures/" + Date.now() + ".jpg";
    copyhelper.move("./pictures/process.jpg", newfilename, function() {
      console.log("new picture taken");
    });

    return newfilename;
  }

}

module.exports = Camera;
