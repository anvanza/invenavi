invenavi
========

Open-Source Ship

Setup
--------
I'm using a raspberry model B+

Libraries
--------
[PiCamera][3] ([documentation][2])

Hardware
--------
 - PCA9685 (Servo Driver)
 - LSM303 (Compass)
 - Bmp180 (Barometric pressure sensor)
 - PI Camera (normal version)
 - Ultimate GPS Breakout v3 (GPS)
 - Standard Size - High Torque - Metal Gear Servo
 - Mtroniks Viper Marine 20
 - Aluminum Double Rudder
 - 2.5:1 gearbox motor, 4.5-15V 540 motor
 - Pursuit V-Hull Boat

*None of the hardware is sponsored!*

I2C addresses
--------
- 1c = Magnetometer
- 6a = Gyroscope
- 77 = Pressure Sensor

Setup RPI
--------
To enable the serial port on Raspbian, you launch `raspi-config`, then select `Interfacing Options`, then `Serial`. You will then be asked two questions:
If you answer `no` to question 1 and `yes` to question 2, then the code and serial port work perfectly.

  [1]: http://www.anvanza.be/
  [2]: http://picamera.readthedocs.org/
  [3]: https://github.com/waveform80/picamera/
