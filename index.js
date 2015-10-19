"use strict";

var Webserver = require("./webserver");
var Command = require("./command");
var IMUDummy = require("./imudummy");
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
    gps_fix: false,
    gps_lat: false,
    gps_lon: false,
    gps_heading: false,
    gps_speed: false,
    gps_alt: false,
    gps_num_sat: false,
  },
  components: {
    webserver: false,
    command: false,
    imu: false,
    pwm: false,
    gps: false,
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
        console.log("starting IMU");
        this.components.imu = new IMUDummy(kernel);
      } else {
        console.warn("can't implement imu yet");
      }
    } else {
      console.warn("IMU already implemented");
    }

  },
  stopComponents: function() {
    console.log("stopping IMU");
    this.components.imu == false;
  }
}

if (argv["dummy"] == true) {
  kernel.config.dummy = true;
}

if (argv["runmode"] == "cli" || typeof argv["runmode"] == "undefined") {
  kernel.components.command = new Command(kernel).start();
} else if (argv["runmode"] == "web") {
  console.log('starting web mode');
  kernel.components.webserver = new Webserver(kernel).start();
} else if (argv["runmode"] == "headless") {
  console.log('starting headless');
} else {
  console.log("runmode not supported, exiting");
}
