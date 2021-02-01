const BerryIMU = require('../lib/berryIMU');

var Imu = function (kernel) {
    let _self = this;
    _self.kernel = kernel;
    let interval;
    let imu = false;

    return {
        start: start,
        stop: stop,
        startCalibration: startCalibration
    };

    /**
     * Start the Imu
     *
     * @returns {start}
     */
    function start() {
        console.log("Starting Imu");

        _self.imu = BerryIMU.open();
        let data = {};

        _self.interval = setInterval(function(){
            try {
                data = _self.imu.fullInformation();
            } catch (e) {
                console.error('error while fetching data from imu');
            }

            _self.kernel.data.heading = data.tiltCompensatedHeading;
            _self.kernel.data.temperature = data.temperature;

        }, 500);

        return _self;
    }

    function startCalibration(timeout) {
        return _self.imu.calibrateCompass(timeout);
    }

    function stop() {

        clearInterval(_self.interval);
        _self.imu = false;

        return this;
    }
};

module.exports = Imu;
