#invenvi core file

import logging
import os

class invenaviKernel:
  def __init__(self, config, debug=False):
        self.config = config
        self.debug = debug
        
        # vehicle
        self._drive_controller = config.drive_controller
        
  def set_throttle(self, throttle_level):
      self._drive_controller.set_throttle(throttle_level)

  def set_steering(self, angle):
      self._drive_controller.set_steering(angle)
      
  def update(self):
    pass
  def halt(self):
    pass
