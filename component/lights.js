// Constructor
var Lights = function (kernel) {
    var _self = this;
    _self.kernel = kernel;
    let mode = "waiting";
    this.ledPin = 36;

    //wiring
    //GND to - LED
    //GPIO16 to + LED
    //3.3v to C1
    //GPIO20 to NC

    return {
        start: start,
        stop: stop
    };

    /**
     *
     * @returns {start}
     */
    function start() {
        _self.rpio = require('rpio');

        /*
         * Set the initial state to low.  The state is set prior to the pin
         * being actived, so is safe for devices which require a stable setup.
         */
        _self.rpio.open(_self.ledPin, _self.rpio.OUTPUT, _self.rpio.LOW);

        /*
        for (var i = 0; i < 5; i++) {
            // On for 1 second
            _self.rpio.write(_self.ledPin, _self.rpio.HIGH);
            console.log("on")
            _self.rpio.sleep(1);

            //Off for half a second (500ms)
            _self.rpio.write(_self.ledPin, _self.rpio.LOW);
            console.log("off")
            _self.rpio.msleep(500);
        }
        */

        //38 == GPIO 20
        _self.rpio.open(38, _self.rpio.INPUT, _self.rpio.PULL_DOWN);
        _self.rpio.poll(38, pollcb, _self.rpio.POLL_HIGH);

        return this;
    }

    function pollcb(pin)
    {
        /*
         * Wait for a small period of time to avoid rapid changes which
         * can't all be caught with the 1ms polling frequency.  If the
         * pin is no longer down after the wait then ignore it.
         */
        _self.rpio.msleep(20);

        if (_self.rpio.read(pin))
            return;

        console.log('Button pressed on pin P%d', pin);
    }

    /**
     * Stop all communication
     *
     * @returns {halt}
     */
    function stop() {

        return this;
    }
};

module.exports = Lights;
