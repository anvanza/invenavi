#invenvi core file

import logging
import os
import time

from model_data import ModelData

class invenaviKernel:
    def __init__(self, config, debug=False):
        self.config = config
        self.debug = debug

        # sensors
        self._gps_sensor = config.gps_sensor
        #self._compass_sensor = config.comass_sensor
        #self._temperature_sensor = config.temperature_sensor

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

    def update(self):
        try:
            self.read_GPS()
        except Exception as ex:
            self.data.has_GPS = False
            logging.exception("CORE:\tError in update loop (GPS) - %s" % ex)

        self.take_picture()
    def halt(self):
        pass
