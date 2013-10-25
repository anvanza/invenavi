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

        #Start GPS
        try:
            self._gps_sensor.start()
            # gpsp now polls every .2 seconds for new data, storing it in self.current_value
            while 1:
                print self._gps_sensor.get_current_value()
                time.sleep(5)
        except (KeyboardInterrupt, SystemExit): #when you press ctrl+c
            print "\nKilling Thread..."
            self._gps_sensor.running = False
            self._gps_sensor.join() # wait for the thread to finish what it's doing
            print "Done.\nExiting."

    def set_throttle(self, throttle_level):
        self._drive_controller.set_throttle(throttle_level)

    def set_steering(self, angle):
        self._drive_controller.set_steering(angle)

    def read_GPS(self):
        if self._gps_sensor:
            self.data.lat = self._gps_info.fix.latitude
            self.data.lon = self._gps_info.fix.longitude
            self.data.altitude = self._gps_info.fix.altitude
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
