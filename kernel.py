#invenvi core file

import logging
import os

from model_data import ModelData

class invenaviKernel:
    def __init__(self, config, debug=False):
        self.config = config
        self.debug = debug

        # sensors
        self._gps_sensor = config.gps_sensor
        #self._compass_sensor = config.compass_sensor
        #self._temperature_sensor = config.temperature_sensor

        # vehicle
        self._drive_controller = config.drive_controller

        # data class
        self.data = POCVModelData()

    def set_throttle(self, throttle_level):
        self._drive_controller.set_throttle(throttle_level)

    def set_steering(self, angle):
        self._drive_controller.set_steering(angle)

    def read_GPS(self):
        if self._gps_sensor:
            (fix, lat, lon, heading, speed, altitude, num_sat, timestamp, datestamp) = self._gps_sensor.read_sensor()
            self.data.fix = fix
            self.data.lat = lat
            self.data.lon = lon
            self.data.gps_heading = heading
            self.data.speed = speed
            self.data.altitude = altitude
            self.data.num_sat = num_sat
            self.data.timestamp = timestamp
            self.data.datestamp = datestamp
            self.data.has_GPS = True
        else:
            self.data.has_GPS = False

    def update(self):
        try:
            self.read_GPS()
        except Exception as ex:
            self.data.has_GPS = False
            logging.exception("CORE:\tError in update loop (GPS) - %s" % ex)
    def halt(self):
        pass