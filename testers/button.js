var rpio = require('rpio');

rpio.open(16, rpio.OUTPUT, rpio.LOW); //GPIO 23
rpio.open(18, rpio.INPUT, rpio.PULL_DOWN); //GPIO 24

function blinkled() {
    /* On for 1 second */
    rpio.write(16, rpio.HIGH);
    rpio.sleep(1);
    rpio.write(16, rpio.LOW);
}

setInterval(blinkled, 500);


function pollcb(pin)
{
    /*
     * Interrupts aren't supported by the underlying hardware, so
     * events may be missed during the 1ms poll window.  The best
     * we can do is to print the current state after an event.
     */
    var state = rpio.read(pin) ? 'pressed' : 'released';
    console.log('Button event on P%d (currently %s)', pin, state);
}

rpio.poll(18, pollcb);