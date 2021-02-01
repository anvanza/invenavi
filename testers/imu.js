const BerryIMU = require('../lib/berryIMU');

const berryimu = BerryIMU.open();

console.log("Detected version :" + berryimu.showVersion());

console.log("Magnetometer values");
console.table(berryimu.readMag());
console.log("heading :" + berryimu.getHeading())
console.log("Start calibration of magnetometer for 10 sec");
console.table(berryimu.calibrateCompass(10000))

console.log("Magnetometer values with calibration");
console.table(berryimu.readMag());
console.log("heading :" + berryimu.getHeading())

console.log("Accelerator values");
console.table(berryimu.readACC());
console.log("G force values");
console.table(berryimu.getGForce());

console.log('Start stream');
setInterval(function(){
    console.table(berryimu.fullInformation());
}, 500);