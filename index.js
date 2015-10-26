"use strict";

var argv = require('minimist')(process.argv.slice(2));

var kernel = {
  config: {
    web_port: 3000,
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
    throttle: 0,
    steering: 0,
  },
  components: {
    webserver: false,
    command: false,
    imu: false,
    drive: false,
    gps: false,
    camera: false,
  },
  update: function() {
    if (this.components.imu != false) {
      console.warn("updating imu");
      console.warn("not implemented yet");
    }
  },
  startComponents: function() {
    //starting imu
    if (this.components.imu == false) {
      if (this.config.dummy) {
        console.log("starting dummy IMU");

        var IMUDummy = rootRequire("./dummy/imudummy");
        this.components.imu = new IMUDummy(kernel);
      } else {
        console.warn("can't implement imu yet");
      }
    } else {
      console.warn("IMU already running");
    }

    //starting gps
    if (this.components.gps == false) {
      if (this.config.dummy) {
        console.log("starting dummy gps");
        this.components.gps = true
      } else {
        var Gps = rootRequire("./component/gps");
        this.components.gps = new Gps(kernel).start();
      }
    } else {
      console.warn("Gps already running");
    }

    //staring camera
    if (this.components.camera == false) {
      if (this.config.dummy) {
        var CameraDummy = rootRequire("./dummy/cameradummy");
        this.components.camera = new CameraDummy(kernel).start();
      } else {
        var Camera = rootRequire("./component/camera");
        this.components.camera = new Camera(kernel).start();
      }
    } else {
      console.warn("Camera already running");
    }

    //staring drive
    if (this.components.drive == false) {
      if (this.config.dummy) {
        var DriveDummy = rootRequire("./dummy/drivedummy");
        this.components.drive = new DriveDummy(kernel).start();
      } else {
        var Drive = rootRequire("./component/drive");
        this.components.drive = new Drive(kernel).start();
      }
    } else {
      console.warn("Drive already running");
    }
  },
  stopComponents: function() {
    console.log("stopping IMU");
    this.components.imu = false;

    console.log("stopping driver");
    this.components.driver = false;

    console.log("stopping gps");
    this.components.gps = false;

    console.log("stopping camera");
    this.components.camera = false;

    console.log("stopping drive");
    if(this.components.drive) {
      this.components.drive.halt();
    }
    this.components.drive = false;
  }
}

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

//set dummy
if (argv["dummy"] == true) {
  kernel.config.dummy = true;
}

if (argv["runmode"] == "cli" || typeof argv["runmode"] == "undefined") {
  var Command = require("./command");
  kernel.components.command = new Command(kernel).start();
} else if (argv["runmode"] == "web") {
  var Webserver = require("./webserver");
  kernel.components.webserver = new Webserver(kernel).start();
} else if (argv["runmode"] == "headless") {
  console.log('starting headless');
} else {
  console.log("runmode not supported, exiting");
}
