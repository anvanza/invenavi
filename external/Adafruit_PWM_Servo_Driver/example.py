#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
import time

# ===========================================================================
# Example Code
# ===========================================================================

# Initialise the PWM device using the default address
# bmp = PWM(0x40, debug=True)
pwm = PWM(0x40, debug=True)

servoMin = 245  # Min pulse length out of 4096 (1 ms = 245/4095 x 16.67ms)
servoNeutral = 368 # neutral pulse length out of 4096 (1.5ms = 368/4095 x 16.67ms)
servoMax = 490  # Max pulse length out of 4096 (2ms = 490/4095 x 16.67ms)

pwm.setPWMFreq(60)  # Set frequency to 50 Hz (servo pulse period = 16.67ms)
while (True):
	# Change speed of continuous servo on channel O
	pwm.setPWM(0, 0, servoMin)
	time.sleep(1)
	pwm.setPWM(0, 0, servoNeutral)
	time.sleep(1)
	pwm.setPWM(0, 0, servoMax)
	time.sleep(1)
	pwm.setPWM(0, 0, servoNeutral)
	time.sleep(1)
