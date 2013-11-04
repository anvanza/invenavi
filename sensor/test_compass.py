#! /usr/bin/python
from Adafruit_LSM303 import LSM303
import os
import time

lsm = LSM303()
while 1:
	print lsm.read()
	time.sleep(1)
	os.system('clear')