// Constructor
var Command = function (kernel) {
  // always initialize all instance properties
  this.kernel = kernel;
  this.stdin = process.stdin;
  this.stdout = process.stdout;

  this.start = function() {
    console.log('starting cli mode');
    this.stdin.resume();
    this.stdin.setEncoding( 'utf8' );
    this.complete();

    // on any data into stdin
    this.stdin.on( 'data', function( data ){
      data = data.toString().trim();

      if (data == 'help') {
        this.help();
      } else if (data == 'start') {
        this.startComponents();
      } else if (data == 'stop') {
        this.stopComponents();
      } else if (data == 'steering') {
        this.steering();
      } else if (data == 'throttle') {
        this.throttle();
      } else if (data == 'update') {
        this.update();
      } else if (data == 'config') {
        this.config();
      } else if (data == 'halt') {
        this.halt();
      } else if ( data == '\u0003' || data == 'quit' || data == 'exit') {
        this.exit();
      } else {
        this.complete();
      }

    }.bind(this));

    return this;
  };

  this.complete = function() {
    this.stdout.write('invenavi$ ');
  }

  this.help = function() {
      console.log("-------------------|>---------------");
      console.log("-------------------|----------------");
      console.log("~~~~~~~~~~~~\\INVENAVI/~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("update     : reads all the sensors");
      console.log("config     : dump config");
      console.log("reset      : reset all engines and servo's");
      console.log("halt       : stop all motors/servo's");
      console.log("start      : start all sensors");
      console.log("stop       : stop all sensors");
      console.log("throttle   : set motor");
      console.log("steering   : set servo angle");
      console.log("add point  : add waypoint for nav");
      console.log("enablenav  : enable navigation");
      console.log("disablenav : disable navigation");
      console.log("takepicture: take a picture");
      console.log("____________________________________");
      console.log("to exit press ctrl+c or exit or quit");

      this.complete();
  };

  this.update = function() {
    console.log('updating all sensors');
    this.kernel.update();
    for (kv in this.kernel.data) {
      console.log(kv + " = " + this.kernel.data[kv]);
    }

    this.complete();
  };

  this.config = function() {
    for (kv in this.kernel.config) {
      console.log(kv + " = " + this.kernel.config[kv]);
    }

    this.complete();
  };

  this.startComponents = function () {
    this.kernel.startComponents();

    this.complete();
  };

  this.stopComponents = function () {
    this.kernel.stopComponents();

    this.complete();
  };

  this.throttle = function (level) {
    this.ask("Throttle level -100 to 100: ",function (data){
      if (this.kernel.components.driver) {
        this.kernel.components.driver.setThrottle(data);
      } else {
        console.log("driver is not initialized yet");
      }

      this.complete();
    }.bind(this));
  };

  this.steering = function (angle) {
    this.ask("Steering angle -100 to 100: ",function (data){
      if (this.kernel.components.driver) {
        this.kernel.components.driver.setSteering(data);
      } else {
        console.log("driver is not initialized yet");
      }

      this.complete();
    }.bind(this));
  };

  this.halt = function () {
    this.components.driver.halt();

    this.complete();
  };

  this.exit = function () {
    console.log('exiting program');
    process.exit();
  };

  this.ask = function (question, callback) {
   this.stdout.write(question + ": ");
   this.stdin.once('data', function(data) {
     data = data.toString().trim();
     callback(data);
   });
 };

}

module.exports = Command;
