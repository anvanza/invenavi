//start timer
const BerryIMU = require('../lib/berryIMU');

const berryimu = BerryIMU.open();

while(true) {
    let MAG = berryimu.readMag();
    console.log(MAG.x + ";" + MAG.y + ";" + MAG.z);
}
