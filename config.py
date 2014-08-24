import logging
import logging.handlers

import os
import time
import platform
import subprocess
import threading

from gps import *
from dummy_devices import (
    DummyCameraController,
    DummyCompassSensor,
    DummyDriveController,
    DummyGPSSensor)

class InvenaviConfig(object):
    _devices = []
    _root_dir = os.path.join(os.getenv("HOME"), "invenavi")

    def __init__(self):
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)
        console = logging.StreamHandler()
        logger.addHandler(console)

        # create directory
        if not os.path.exists(self.logs_path):
            os.makedirs(self.logs_path)

        # add file logging
        log_file_stem = os.path.join(self.logs_path, 'invenavi_%s.log' % time.strftime('%Y%m%d_%H%M%S'))
        handler = logging.handlers.RotatingFileHandler(log_file_stem, backupCount=50)
        formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        # default attachments to None
        self.gps_sensor = None
        self.compass_sensor = None
        self.barometer_sensor = None
        self.drive_controller = None
        self.camera_controller = None

        # RPC config
        self._rpc_port = None

    #
    # RPC config
    #

    @property
    def rpc_port(self):
        return self._rpc_port

    @rpc_port.setter
    def rpc_port(self, value):
        self._rpc_port = value

    #
    # file / paths section
    #
    @property
    def logs_path(self):
        return os.path.join(self._root_dir, "logs")

    def configure_devices(self, debug=False):
        """ Configures i2c devices when running in appropriate environment. """

        # running as root on linux so can scan for devices and configure them
        # although inline imports normally not encouraged
        # enables me to load dependencies only when I know I can (eg linux, i2c, root, etc...)
        import raspberrypi

        # i2c devices
        try:
            logging.info("CFG:\tConfiguring i2c devices...")
            # scan for connected devices
            i2c_addresses = self.scan_i2c(debug=debug)

            # lookup available device drivers by address
            for addr, in_use in i2c_addresses:
                device_name, device_driver = self.lookup(addr, debug=debug)
                self._devices.append([addr, device_name, device_driver, in_use])

        except Exception as ex:
            logging.exception("CFG:\tError scanning i2c devices - %s" % ex)

        #GPS init
        try:
            from sensor.GPS_serial import GPSSensor
            self.gps_sensor = GPSSensor()
        except Exception as ex:
            logging.warning("CFG:\tError setting up GPS over serial - %s" % ex)

        #camera unit
        try:
            from sensor.Camera import CameraController
            self.camera_controller = CameraController()
        except Exception as ex:
            logging.warning("CFG:\tError setting up Camera - %s" % ex)

        # Add dummies for devices that are still missing.
        self._set_dummy_devices()


    def lookup(self, addr, debug=False):
        """ lookup available device drivers by hex address,
            import and create driver class,
            setup particular devices so easily retrieved by consumers. """
        if(debug):
            logging.debug("CFG:\tChecking for driver for device at i2c %s" % addr)

        # note: i2c addresses can conflict
        # could scan registers etc to confirm count etc?
        import raspberrypi

        if addr == 0x19:
            try:
                from sensor.Adafruit_LSM303DLHC import LSM303DLHC
                self.compass_sensor = LSM303DLHC(0x19, 0x1E, debug)
                self.compass_sensor.set_temp_enabled(True)
            except Exception as ex:
                logging.warning("CFG:\tError setting up COMPASS over i2c - %s" % ex)
            return "COMPASS", self.barometer_sensor

        elif addr == 0x40:
            try:
                from vehicle.drive_controller import AdafruitDriveController
                self.drive_controller = AdafruitDriveController(i2c_addr=addr, debug=debug)
            except Exception as ex:
                logging.info("CFG:\tError setting up DRIVECONTROLLER over i2c - %s" % ex)
            return "DRIVECONTROLLER", self.drive_controller

        elif addr == 0x77:
            try:
                from sensor.Adafruit_BMP085 import BMP085
                self.barometer_sensor = BMP085(debug=debug)
            except Exception as ex:
                logging.warning("CFG:\tError setting up BAROMETER over i2c - %s" % ex)
            return "BAROMETER", self.barometer_sensor

        else:
            return "unknown", None

    def scan_i2c(self, debug=False):
        """scans i2c port returning a list of detected addresses.
            Requires sudo access.
            Returns True for in use by a device already (ie UU observed)"""

        import raspberrypi

        proc = subprocess.Popen(['sudo', 'i2cdetect', '-y', raspberrypi.i2c_bus_num()],
                stdout = subprocess.PIPE,
                close_fds = True)
        std_out_txt, std_err_txt = proc.communicate()

        if debug:
            logging.debug(std_out_txt)
            logging.debug(std_err_txt)

        # i2c returns
        #  -- for unused addresses
        #  UU for addresses n use by a device
        #  0x03 to 0x77 for detected addresses
        # need to keep columns if care about UU devices
        addr = []
        lines = std_out_txt.rstrip().split("\n")

        if lines[0] in "command not found":
            raise RuntimeError("i2cdetect not found")

        for i in range(0,8):
            for j in range(0,16):
                idx_i = i+1
                idx_j = j*3+4
                cell = lines[idx_i][idx_j:idx_j+2].strip()
                if cell and cell != "--":
                    logging.info("    ...device at: %s %s", hex(16*i+j), cell)
                    hexAddr = 16*i+j
                    if cell == "UU":
                        addr.append([hexAddr, True])
                    else:
                        addr.append([hexAddr, False])

        return addr

    def _set_dummy_devices(self):
        """ Goes through the list of devices and adds a dummy for every
            missing device """

        # We do not set dummy devices for Magnetometer or Accelerometer.
        # Later this should be handled differently

        if not self.gps_sensor:
            self.gps_sensor = DummyGPSSensor(fix=3, lat=90)
            logging.info("CFG:\tLoaded dummy GPS driver")
            # set dummy gps here.

        if not self.compass_sensor:
            self.compass_sensor = DummyCompassSensor()
            logging.info("CFG:\tLoaded dummy compass driver")
            # set dummy compass here.

        if not self.drive_controller:
            self.drive_controller = DummyDriveController()
            logging.info("CFG:\tLoaded dummy drive controller")

        if not self.camera_controller:
            self.camera_controller = DummyCameraController()
            logging.info("CFG:\tLoaded dummy camera driver")
