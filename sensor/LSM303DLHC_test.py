#!/usr/bin/python
# encoding: utf-8
"""
LSM303DLHC_test.py

Created by Shigeru KAWAGUCHI on 2013-01-18.
Copyright (c) 2013 __Lamb Informatics Limited__. All rights reserved.
"""

import sys
import os
import time
from datetime import datetime, date
from Adafruit_LSM303DLHC import LSM303DLHC

lsm = LSM303DLHC(0x19, 0x1E, False)
lsm.setTempEnabled(True)

while(1):
    time.sleep(0.25)
    accel = lsm.readAccelerationsG()
    mag = lsm.readMagneticsGauss()
    temp = lsm.readTemperatureCelsius()
    heading = lsm.readMagneticHeading()

    print "Temp:    %6.3f C" % (temp)
    print "Heading: %6.3f" % (heading)