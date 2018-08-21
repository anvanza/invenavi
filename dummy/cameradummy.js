var FileHelper = require("../helper/file");

// Constructor
var CameraDummy = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        take: take
    };

    /**
     * Start the Camera
     *
     * @returns {CameraDummy}
     */
    function start() {
        console.log("Starting Dummy Camera");

        return _self;
    }

    /**
     * Take a picture
     * A new dummy file is created
     *
     * @returns void
     */
    function take(callback) {

        var filehelper = new FileHelper();
        var newfilename = "./pictures/" + Date.now() + ".jpg";

        filehelper.createDummy("./pictures/process.jpg", "hey hey", function () {
            filehelper.move("./pictures/process.jpg", newfilename, function () {
                callback(newfilename);
            });
        });
    }
};

module.exports = CameraDummy;
