#! /usr/bin/python
from Adafruit_LSM303 import LSM303

lsm = LSM303()
while 1:
	print lsm.read()