const lib = require('nrf24');
const radio = new lib.nRF24(22, 0);

radio.begin(true);
radio.config({
    PALevel: lib.RF24_PA_MAX,
    DataRate: lib.RF24_250KBPS,
    Channel: 76,
    CRCLength: lib.RF24_CRC_16,
}, true);

console.log("Radio connected:" + radio.present());


var Pipes= ["0x65646f4e31","0x65646f4e32"]; // "1Node", "2Node"
radio.useWritePipe(Pipes[1]);
radio.addReadPipe(Pipes[0]);
console.log("Open Write Pipe "+ Pipes[1]+ " reading from " + Pipes[0]);


setInterval(() => {
    radio.write(
        Buffer.from('Hello world'),
        function (success,tx_ok,tx_bytes,tx_req,frame_size,aborted) {
            console.log("Transfered:"+tx_bytes+ " total:" + tx_req + " OK->" + tx_ok);
        }
    );
}, 100);