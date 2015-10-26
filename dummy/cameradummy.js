// Constructor
var CameraDummy = function (kernel) {
  this.kernel = kernel;

  this.start = function() {
    console.log("Starting Dummy Camera");

    return this;
  }

  this.take = function() {
    console.log("Dummy picture taken");
    return "./pictures/example.jpg";
  }
}

module.exports = CameraDummy;
