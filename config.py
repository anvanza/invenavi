import logging
import logging.handlers

import os
import time

class invenaviConfig(object):

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
        
        self.drive_controller = DummyDriveController()
        
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
        pass
    
    def set_steering(self, angle):
        logging.debug("DRIVE:\tSteering set to: %s" % angle)
        self.steering_angle = angle
        pass
    
    def halt(self):
        logging.debug("DRIVE:\tDrive halting.")
        self.throttle_level = 0.0
        self.steering_angle = 0.0
        pass
