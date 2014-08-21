import os
import logging


class DummyCameraController(object):
    """ 'Dummy' camera controller that just logs. """

    def take_picture(self):
        logging.debug("CAM:\tCapture image.")

    @property
    def last_img(self):
        return self._last_img


class DummyDriveController(object):
    """ 'Dummy' drive controller that just logs. """

    # current state
    throttle_level = 0.0
    steering_angle = 0.0

    def __init__(self):
        pass

    def set_throttle(self, throttle_level):
        logging.debug("DRIVE:\tThrottle set to: %s" % throttle_level)
        self.throttle_level = throttle_level

    def set_steering(self, angle):
        logging.debug("DRIVE:\tSteering set to: %s" % angle)
        self.steering_angle = angle

    def halt(self):
        logging.debug("DRIVE:\tDrive halting.")
        self.throttle_level = 0.0
        self.steering_angle = 0.0


class DummyCompassSensor(object):
    """ 'Dummy' compass sensor that outputs a static heading value. """

    def __init__(self, interface="", hw_interface="-1", debug=False,heading=0.0, pitch=0.0, roll=0.0):
        self.debug = debug
        if self.debug:
            logging.basicConfig(level=logging.DEBUG)
        self.heading = heading
        self.pitch = pitch
        self.roll = roll

    def read_sensor(self):
        return self.heading, self.pitch, self.roll
    def readMagneticHeading(self):
        return self.heading

class DummyGPSSensor(object):
    """ 'Dummy' GPS sensor that outputs static GPS data. """
    def __init__(self, interface="", hw_interface="", debug=False,
            fix=1, lat=0.0, lon=0.0, head=0.0, speed=0.0, alt=0.0,
            sat=0, time="", date=""):
        self.gps_data = (
            fix,      # fix
            lat,      # lat
            lon,      # lon
            alt,      # altitude
            sat,      # num_sat
            time,     # timestamp
            )     # datestamp

    def read_sensor(self):
        return self.gps_data