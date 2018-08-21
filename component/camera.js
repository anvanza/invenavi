const RaspiCam = require("raspicam");
const FileHelper = require("../helper/file");

var Camera = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    return {
        start: start,
        take: take
    };

    /**
     * Start the Camera
     *
     * @returns {Camera}
     */
    function start() {
        var filehelper = new FileHelper();
        _self.camera = new RaspiCam({
            mode: 'photo',
            output: './pictures/process.jpg',
            encoding: 'jpg',
            timeout: 100,
            quality: 100
        });

        _self.camera.on("read", function (err, timestamp, filename) {
            var newfilename = "./pictures/" + Date.now() + ".jpg";
            filehelper.move("./pictures/process.jpg", "./pictures/" + Date.now() + ".jpg", function () {
                callback(newfilename);
            });
        });

        console.log("Camera started");

        return _self;
    }

    /**
     * Take a picture
     * Callback is handled by the start method
     *
     * @returns void
     */
    function take() {
        _self.camera.start();
    }
};

module.exports = Camera;
