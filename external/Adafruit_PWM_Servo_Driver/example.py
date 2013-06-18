#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
import time

# ===========================================================================
# Example Code
# ===========================================================================

# Initialise the PWM device using the default address
# bmp = PWM(0x40, debug=True)
pwm = PWM(0x40, debug=True)

servoMin = 200  # Min pulse length out of 4096 (1 ms = 200/4095 x 20ms)
servoNeutral = 300 # neutral pulse length out of 4096 (1.5ms = 300/4095 x 20ms)
servoMax = 400  # Max pulse length out of 4096 (2ms = 400/4095 x 20ms)

pwm.setPWMFreq(50)  # Set frequency to 50 Hz (servo pulse period = 20ms)
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
