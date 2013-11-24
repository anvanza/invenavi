#invenvi core file

import logging
import os
import time
import subprocess

from model_data import ModelData

class invenaviKernel:
    def __init__(self, config, debug=False):
        self.config = config
        self.debug = debug

        # sensors
        self._gps_sensor = config.gps_sensor
        self._compass_sensor = config.compass_sensor
        self._barometer_sensor = config.barometer_sensor

        # vehicle
        self._drive_controller = config.drive_controller

        # data class
        self.data = ModelData()

    def set_throttle(self, throttle_level):
        self._drive_controller.set_throttle(throttle_level)

    def set_steering(self, angle):
        self._drive_controller.set_steering(angle)

    def read_GPS(self):
        if self._gps_sensor:
            (fix, lat, lon, altitude, num_sat, timestamp) = self._gps_sensor.read_sensor()
            self.data.lat = lat
            self.data.lon = lon
            self.data.altitude = altitude
            self.data.has_GPS = True
        else:
            self.data.has_GPS = False
    def take_picture(self):
        #take picture
        subprocess.call(["raspistill", "-o" , "invenavi.jpg" , "-q" , "100" ,"-w" , "300" , "-h", "300" , "-rot" , "180" ,"-t" , "0"])

    def read_barometer(self):
        if self._barometer_sensor:
            self.data.temperature = self._barometer_sensor.readTemperature()
            self.data.pressure = self._barometer_sensor.readPressure()
            self.data.has_temperature = True
            self.data.has_pressure = True
        else:
            self.data.has_temperature = False
            self.data.has_pressure = False

    def read_compass(self):
        if self._compass_sensor:
            self.data.compass_heading = self._compass_sensor.readMagneticHeading()
            self.data.has_compass = True
        else:
            self.data.has_compass = False

    def update(self):
        try:
            self.read_GPS()
        except Exception as ex:
            self.data.has_GPS = False
            logging.exception("CORE:\tError in update loop (GPS) - %s" % ex)

        try:
            self.read_barometer()
        except Exception as ex:
            self.data.has_pressure = False
            self.data.has_temperature = False
            logging.exception("CORE:\tError in update loop (BAROMETER) - %s" % ex)

        try:
            self.read_compass()
        except Exception as ex:
            self.data.has_compass = False
            logging.exception("CORE:\tError in update loop (COMPASS) - %s" % ex)

        self.take_picture()
    def halt(self):
        pass
