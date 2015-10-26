// Constructor
var CameraDummy = function (kernel) {
  this.kernel = kernel;
  var FileHelper = rootRequire("./helper/file");
  var filehelper = new FileHelper();

  this.start = function() {
    console.log("Starting Dummy Camera");

    return this;
  }

  this.take = function() {

    filehelper.createDummy("./pictures/process.jpg","hey hey",function(){
        console.log("dummy file created");
    });

    var newfilename = "./pictures/" + Date.now() + ".jpg";
    filehelper.move("./pictures/process.jpg", newfilename, function() {
      console.log("new dummy picture taken");
    });

    return newfilename;
  }
}

module.exports = CameraDummy;
