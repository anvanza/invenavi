// Constructor
var Communication = function (kernel) {
    var _self = this;
    _self.kernel = kernel;

    const lib = require('nrf24');
    const radio = new lib.nRF24(22, 0);
    const pipes = ["0x65646f4e31","0x65646f4e32"]; // "1Node", "2Node"

    return {
        start: start,
        stop: stop
    };

    /**
     *
     * @returns {start}
     */
    function start() {
        radio.begin();
        radio.config({
            PALevel: lib.RF24_PA_MAX,
            DataRate: lib.RF24_250KBPS,
            Channel: 76,
            CRCLength: lib.RF24_CRC_16,
        }, _self.kernel.config.debug);

        console.log("Radio connected:" + radio.present());

        radio.useWritePipe(pipes[1]);
        radio.addReadPipe(pipes[0], true); // listen in pipe "0x65646f4e31" with AutoACK enable

        radio.changeWritePipe(true,512); // Set max stream size to 2Kb

        console.log("Open Write Pipe "+ pipes[1]+ " reading from " + pipes[0]);

        // Register callback for reading
        radio.read( function(data,n) {
            // when data arrive on any registered pipe this function is called
            // data -> JS array of objects with the follwing props:
            //     [{pipe: pipe id, data: nodejs with the data },{ ... }, ...]
            // n -> number elements of data array

            //perform commands
            let command = data[0].data.toString().replace(/^[\s\uFEFF\xA0\0]+|[\s\uFEFF\xA0\0]+$/g, "");
            if (command === "TU") {
                console.log("Throttle up command rcvd");
                _self.kernel.components.drive.setThrottle(_self.kernel.data.throttle + 25);
            } else if (command === "TD") {
                console.log("Throttle down command rcvd");
                _self.kernel.components.drive.setThrottle(_self.kernel.data.throttle - 25);
            } else if (command === "L") {
                    console.log("Left command rcvd");
                    _self.kernel.components.drive.setSteering(_self.kernel.data.steering - 100);
            } else if (command === "R") {
                console.log("Right command rcvd");
                _self.kernel.components.drive.setSteering(_self.kernel.data.steering + 100);
            } else if (command === "S") {
                console.log("Stop command rcvd");
                _self.kernel.components.drive.setSteering(0);
                _self.kernel.components.drive.setThrottle(0);
            } else {
                console.log("unknown command (" + typeof command+ ")'" + command + "'");
            }
        },function(isStopped,by_user,error_count) {
            // This will be if the listening process is stopped.
        });

        //start sending out our information
        setInterval(() => {
            for (let key in _self.kernel.data) {
                radio.write(
                    Buffer.from(JSON.stringify(key + "|" + _self.kernel.data[key])),
                    function (success,tx_ok,tx_bytes,tx_req,frame_size,aborted) {
                        //console.log("Transfered:"+tx_bytes+ " total:" + tx_req + " OK->" + tx_ok);
                    }
                );
            }

        }, 2000);

        return this;
    }

    /**
     * Stop all communication
     *
     * @returns {halt}
     */
    function stop() {

        //stop interval

        return this;
    }
};

module.exports = Communication;
