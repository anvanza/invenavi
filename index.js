"use strict";

const argv = require('minimist')(process.argv.slice(2));
const os = require('os');

var kernel = {
    config: {
        web_port: 80,
        debug: false,
        dummy: false
    },
    data: {
        temperature: false,
        pressure: false,
        gps_lat: false,
        gps_lon: false,
        gps_speed: false,
        gps_alt: false,
        gps_sats: false,
        throttle: 0,
        steering: 0,
        heading: 0,
    },
    components: {
        webserver: false,
        command: false,
        imu: false,
        drive: false,
        gps: false,
        camera: false,
        communication: false,
        lights: false,
    },
    dummy: function () {
        this.config.dummy = true;
    },
    update: function () {
        if (this.components.imu !== false) {
            console.warn("updating imu.js");
            console.warn("not implemented yet");
        }
    },
    calibrateIMU: function () {
        if (this.components.imu !== false) {
            console.log("starting calibration")
            return this.components.imu.startCalibration(10000);
        }
    },
    startComponents: function () {
        //starting imu.js
        if (this.components.imu !== false) {
            console.warn("IMU already running");
        }
        if (this.config.dummy) {
            var IMUDummy = require("./dummy/imudummy");
            this.components.imu = new IMUDummy(kernel);
            this.components.imu.start();
        } else {
            var Imu = require("./component/imu");
            this.components.imu = new Imu(kernel);
            this.components.imu.start();
        }

        //starting gps
        if (this.components.gps !== false) {
            console.warn("Gps already running");
        }
        if (this.config.dummy) {
            var GpsDummy = require("./dummy/gpsdummy");
            this.components.gps = new GpsDummy(kernel).start()
        } else {
            var Gps = require("./component/gps");
            this.components.gps = new Gps(kernel).start();
        }

        //starting communications
        if (this.components.communication !== false) {
            console.warn("Comm already running");
        }
        if (this.config.dummy) {
            //var CommDummy = require("./dummy/gpsdummy");
            //this.components.gps = new GpsDummy(kernel).start()
        } else {
            var Communication = require("./component/communication");
            this.components.communication = new Communication(kernel).start();
        }

        //starting ligths
        if (this.components.lights !== false) {
            console.warn("Lights already running");
        }
        if (this.config.dummy) {
            //var CommDummy = require("./dummy/gpsdummy");
            //this.components.gps = new GpsDummy(kernel).start()
        } else {
            var Lights = require("./component/lights");
            this.components.lights = new Lights(kernel).start();
        }

        //starting camera
        if (this.components.camera !== false) {
            console.warn("Camera already running");
        }
        if (this.config.dummy) {
            var CameraDummy = require("./dummy/cameradummy");
            this.components.camera = new CameraDummy(kernel).start();
        } else {
            var Camera = require("./component/camera");
            this.components.camera = new Camera(kernel).start();
        }

        //staring drive
        if (this.components.drive !== false) {
            console.warn("Drive already running");
        }
        if (this.config.dummy) {
            var DriveDummy = require("./dummy/drivedummy");
            this.components.drive = new DriveDummy(kernel).start();
        } else {
            if (os.arch() !== "arm") {
                console.error("This is not a raspberry, could not start i2c");
            } else {
                var Drive = require("./component/drive");
                this.components.drive = new Drive(kernel).start();
            }

        }
    },
    stopComponents: function () {
        console.log("stopping IMU");
        if (this.components.imu) {
            this.components.imu.stop();
        }
        this.components.imu = false;

        console.log("stopping driver");
        this.components.driver = false;

        console.log("stopping gps");
        if (this.components.gps) {
            this.components.gps.stop();
        }
        this.components.gps = false;

        console.log("stopping camera");
        this.components.camera = false;

        console.log("stopping drive");
        if (this.components.drive) {
            this.components.drive.halt();
        }
        this.components.drive = false;

        console.log("stopping communications");
        if (this.components.communication) {
            this.components.communication.stop();
        }
        this.components.communication = false;


        console.log("stopping Lights");
        if (this.components.lights) {
            this.components.lights.stop();
        }
        this.components.lights = false;
    },
    startWebServer: function () {
        const WebServer = require("./component/webserver");
        this.components.webserver = new WebServer(kernel).start();
    },
    stopWebServer: function () {
        if (this.components.webserver === false) {
            console.log("webserver not started");
            return;
        }

        this.components.webserver.stop();
        this.components.webserver = false;
    },
    startCommand: function () {
        const Command = require('./component/command');
        this.components.command = new Command(kernel).start();
    },
};

//set dummy
if (typeof argv["dummy"] !== "undefined") {
    kernel.dummy();
}

//always start command
kernel.startCommand();

if (argv["runmode"] === "web") {
    kernel.startWebServer();
}
