#invenvi core file

import logging
import os
import time

from model_data import ModelData
from navigation.Navigation import Navigation

class InvenaviKernel:
    def __init__(self, config, debug=False):
        self.config = config
        self.debug = debug

        # sensors
        self._gps_sensor = config.gps_sensor
        self._compass_sensor = config.compass_sensor
        self._barometer_sensor = config.barometer_sensor

        # vehicle
        self._drive_controller = config.drive_controller

        # camera
        self._camera_controller = config.camera_controller

        # navigation
        self._navigation_controller = Navigation(self)
        self._navigationCanRun = False

        # data class
        self.data = ModelData()

    #Navigation
    def run_navigation(self):
        self._navigation_controller.run()

    def add_point(self,lat,lon):
        self._navigation_controller.add_point(lat,lon)

    def clear_points(self):
        self._navigation_controller.clear_points()

    def cur_waypoint(self):
        return self._navigation_controller.current()

    def navigation_running(self):
        if self._navigationCanRun:
            return False
        else:
            return True

    #DriveControlle
    def set_throttle(self, throttle_level):
        self._drive_controller.set_throttle(throttle_level)

    def set_steering(self, angle):
        self._drive_controller.set_steering(angle)

    def get_throttle(self,):
        return self._drive_controller.throttle_level

    def get_steering(self):
        return self._drive_controller.steering_angle

    #GPS
    def read_gps(self):
        if self._gps_sensor:
            (fix, lat, lon, altitude, num_sat, timestamp) = self._gps_sensor.read_sensor()
            self.data.lat = lat
            self.data.lon = lon
            self.data.altitude = altitude
            self.data.has_GPS = True
        else:
            self.data.has_GPS = False


    #Sensors
    def read_barometer(self):
        if self._barometer_sensor:
            self.data.temperature = self._barometer_sensor.read_temperature()
            self.data.pressure = self._barometer_sensor.read_pressure()
            self.data.has_temperature = True
            self.data.has_pressure = True
        else:
            self.data.has_temperature = False
            self.data.has_pressure = False

    def read_compass(self):
        if self._compass_sensor:
            self.data.compass_heading = self._compass_sensor.read_magnetic_heading()
            self.data.has_compass = True
        else:
            self.data.has_compass = False

    #General
    def update(self):
        try:
            self.read_gps()
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
        
    def halt(self):
        self._drive_controller.halt()
