var servopi = require('../lib/servopi');

var pwm = new ServoPi(0x40);

pwm.setPWMFrequency(60);
pwm.outputEnable();

var positions = [100, 150, 200];
var count = 0;
var myTimer = setInterval(clockTimer, 1000);

function clockTimer() {
    // move the
    pwm.setPWM(0, 0, positions[count]);
    count++;
    if (count > positions.length) {
        count = 0;
    }
}