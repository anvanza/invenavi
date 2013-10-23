import logging
import logging.handlers

import os
import time
import platform
import subprocess
import threading

from gps import *

class GpsPoller(threading.Thread):
   def __init__(self):
       threading.Thread.__init__(self)
       self.session = gps(mode=WATCH_ENABLE)
       self.current_value = None

   def get_current_value(self):
       return self.current_value

   def run(self):
        try:
            while True:
                self.current_value = session.next()
                time.sleep(0.2) # tune this, you might not get values that quickly
        except StopIteration:
            pass

class invenaviConfig(object):
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
        self.temperature_sensor = None
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
            self.gps_sensor = GpsPoller()
        except Exception as ex:
            logging.warning("CFG:\tError setting up GPS over serial - %s" % ex)


    def lookup(self, addr, debug=False):
        """ lookup available device drivers by hex address,
            import and create driver class,
            setup particular devices so easily retrieved by consumers. """
        if(debug):
            logging.debug("CFG:\tChecking for driver for device at i2c %s" % addr)

        # TODO replace with reading from config? probably use ConfigParser?
        # note: i2c addresses can conflict
        # could scan registers etc to confirm count etc?
        import raspberrypi

        if addr == 0x68:
            return "RTC", "Driver not loaded - DS1307"

        elif addr == 0x40: #or addr == 0x70:
            # DriveController (using Adafruit PWM board) (not sure what 0x70 address is for...)
            try:
                from vehicle.drive_controller import AdafruitDriveController
                # TODO pwm addresses from config?
                self.drive_controller = AdafruitDriveController(i2c_addr=addr, i2c_bus=raspberrypi.i2c_bus(), debug=debug)
            except Exception as ex:
                logging.info("CFG:\tError setting up DRIVECONTROLLER over i2c - %s" % ex)
            return "DRIVECONTROLLER", self.drive_controller

        elif addr == 0x1E:
            return "COMPASS", "Driver not loaded - HMC5883L"

        elif addr == 0x53 or addr == 0x1D:
            # 0x53 when ALT connected to HIGH
            # 0x1D when ALT connected to LOW
            return "ACCELEROMETER", "Driver not loaded - ADXL345"

        elif addr == 0x69:
            # 0x68 when AD0 connected to LOW - conflicts with DS1307!
            # 0x69 when AD0 connected to HIGH
            return "GYRO", "Driver not loaded - ITG3200"

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

        # TODO could probably be neater with eg format or regex
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
