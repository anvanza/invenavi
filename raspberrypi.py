import os
import smbus
import subprocess

def i2c_bus():
    return smbus.SMBus(1)

def i2c_bus_num():
        return '1'

def serial_bus():
    return "/dev/ttyUSB0"
    #return "/dev/ttyAMA0"