#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
import time

# ===========================================================================
# Example Code
# ===========================================================================

# Initialise the PWM device using the default address
# bmp = PWM(0x40, debug=True)
pwm = PWM(0x40, debug=True)

servoMin = 100  # Min pulse length out of 4096
servoMax = 200  # Max pulse length out of 4096

pwm.setPWMFreq(60)                        # Set frequency to 60 Hz
while (True):
  # Change speed of continuous servo on channel O
  pwm.setPWM(0, 0, servoMin)
  time.sleep(1)
  pwm.setPWM(0, 0, servoMax)
  time.sleep(1)