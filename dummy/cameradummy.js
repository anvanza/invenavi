// Constructor
var CameraDummy = function (kernel) {
  this.kernel = kernel;
  var FileHelper = rootRequire("./helper/file");
  var filehelper = new FileHelper();

  this.start = function() {
    console.log("Starting Dummy Camera");

    return this;
  }

  this.take = function(callback) {
    var newfilename = "./pictures/" + Date.now() + ".jpg";

    filehelper.createDummy("./pictures/process.jpg","hey hey",function() {
      filehelper.move("./pictures/process.jpg", newfilename, function() {
        callback(newfilename);
      });
    });
  }
}

module.exports = CameraDummy;
