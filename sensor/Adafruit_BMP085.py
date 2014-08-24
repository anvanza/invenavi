#!/usr/bin/python

import time
from Adafruit_I2C import Adafruit_I2C

# ===========================================================================
# BMP085 Class
# ===========================================================================

class BMP085 :
    i2c = None

    # Operating Modes
    __BMP085_ULTRALOWPOWER     = 0
    __BMP085_STANDARD          = 1
    __BMP085_HIGHRES           = 2
    __BMP085_ULTRAHIGHRES      = 3

    # BMP085 Registers
    __BMP085_CAL_AC1           = 0xAA  # R   Calibration data (16 bits)
    __BMP085_CAL_AC2           = 0xAC  # R   Calibration data (16 bits)
    __BMP085_CAL_AC3           = 0xAE  # R   Calibration data (16 bits)
    __BMP085_CAL_AC4           = 0xB0  # R   Calibration data (16 bits)
    __BMP085_CAL_AC5           = 0xB2  # R   Calibration data (16 bits)
    __BMP085_CAL_AC6           = 0xB4  # R   Calibration data (16 bits)
    __BMP085_CAL_B1            = 0xB6  # R   Calibration data (16 bits)
    __BMP085_CAL_B2            = 0xB8  # R   Calibration data (16 bits)
    __BMP085_CAL_MB            = 0xBA  # R   Calibration data (16 bits)
    __BMP085_CAL_MC            = 0xBC  # R   Calibration data (16 bits)
    __BMP085_CAL_MD            = 0xBE  # R   Calibration data (16 bits)
    __BMP085_CONTROL           = 0xF4
    __BMP085_TEMPDATA          = 0xF6
    __BMP085_PRESSUREDATA      = 0xF6
    __BMP085_READTEMPCMD       = 0x2E
    __BMP085_READPRESSURECMD   = 0x34

    # Private Fields
    _cal_AC1 = 0
    _cal_AC2 = 0
    _cal_AC3 = 0
    _cal_AC4 = 0
    _cal_AC5 = 0
    _cal_AC6 = 0
    _cal_B1 = 0
    _cal_B2 = 0
    _cal_MB = 0
    _cal_MC = 0
    _cal_MD = 0

    # Constructor
    def __init__(self, address=0x77, mode=1, debug=False):
        self.i2c = Adafruit_I2C(address)

        self.address = address
        self.debug = debug
        # Make sure the specified mode is in the appropriate range
        if ((mode < 0) | (mode > 3)):
            if (self.debug):
                print "Invalid Mode: Using STANDARD by default"
            self.mode = self.__BMP085_STANDARD
        else:
            self.mode = mode
        # Read the calibration data
        self.read_calibration_data()

    def read_calibration_data(self):
        """Reads the calibration data from the IC"""
        self._cal_AC1 = self.i2c.readS16(self.__BMP085_CAL_AC1)   # INT16
        self._cal_AC2 = self.i2c.readS16(self.__BMP085_CAL_AC2)   # INT16
        self._cal_AC3 = self.i2c.readS16(self.__BMP085_CAL_AC3)   # INT16
        self._cal_AC4 = self.i2c.readU16(self.__BMP085_CAL_AC4)   # UINT16
        self._cal_AC5 = self.i2c.readU16(self.__BMP085_CAL_AC5)   # UINT16
        self._cal_AC6 = self.i2c.readU16(self.__BMP085_CAL_AC6)   # UINT16
        self._cal_B1 = self.i2c.readS16(self.__BMP085_CAL_B1)     # INT16
        self._cal_B2 = self.i2c.readS16(self.__BMP085_CAL_B2)     # INT16
        self._cal_MB = self.i2c.readS16(self.__BMP085_CAL_MB)     # INT16
        self._cal_MC = self.i2c.readS16(self.__BMP085_CAL_MC)     # INT16
        self._cal_MD = self.i2c.readS16(self.__BMP085_CAL_MD)     # INT16
        if (self.debug):
            self.show_calibration_data()

    def show_calibration_data(self):
        """Displays the calibration values for debugging purposes"""
        print "DBG: AC1 = %6d" % (self._cal_AC1)
        print "DBG: AC2 = %6d" % (self._cal_AC2)
        print "DBG: AC3 = %6d" % (self._cal_AC3)
        print "DBG: AC4 = %6d" % (self._cal_AC4)
        print "DBG: AC5 = %6d" % (self._cal_AC5)
        print "DBG: AC6 = %6d" % (self._cal_AC6)
        print "DBG: B1  = %6d" % (self._cal_B1)
        print "DBG: B2  = %6d" % (self._cal_B2)
        print "DBG: MB  = %6d" % (self._cal_MB)
        print "DBG: MC  = %6d" % (self._cal_MC)
        print "DBG: MD  = %6d" % (self._cal_MD)

    def read_raw_temp(self):
        """Reads the raw (uncompensated) temperature from the sensor"""
        self.i2c.write8(self.__BMP085_CONTROL, self.__BMP085_READTEMPCMD)
        time.sleep(0.005)  # Wait 5ms
        raw = self.i2c.readU16(self.__BMP085_TEMPDATA)
        if (self.debug):
            print "DBG: Raw Temp: 0x%04X (%d)" % (raw & 0xFFFF, raw)
        return raw

    def read_raw_pressure(self):
        """Reads the raw (uncompensated) pressure level from the sensor"""
        self.i2c.write8(self.__BMP085_CONTROL, self.__BMP085_READPRESSURECMD + (self.mode << 6))
        if (self.mode == self.__BMP085_ULTRALOWPOWER):
            time.sleep(0.005)
        elif (self.mode == self.__BMP085_HIGHRES):
            time.sleep(0.014)
        elif (self.mode == self.__BMP085_ULTRAHIGHRES):
            time.sleep(0.026)
        else:
            time.sleep(0.008)
        msb = self.i2c.readU8(self.__BMP085_PRESSUREDATA)
        lsb = self.i2c.readU8(self.__BMP085_PRESSUREDATA+1)
        xlsb = self.i2c.readU8(self.__BMP085_PRESSUREDATA+2)
        raw = ((msb << 16) + (lsb << 8) + xlsb) >> (8 - self.mode)
        if (self.debug):
            print "DBG: Raw Pressure: 0x%04X (%d)" % (raw & 0xFFFF, raw)
        return raw

    def read_temperature(self):
        """Gets the compensated temperature in degrees celsius"""

        # Read raw temp before aligning it with the calibration values
        ut = self.read_raw_temp()
        x1 = ((ut - self._cal_AC6) * self._cal_AC5) >> 15
        x2 = (self._cal_MC << 11) / (x1 + self._cal_MD)
        b5 = x1 + x2
        temp = ((b5 + 8) >> 4) / 10.0
        if (self.debug):
            print "DBG: Calibrated temperature = %f C" % temp
        return temp

    def read_pressure(self):
        """Gets the compensated pressure in pascal"""

        ut = self.read_raw_temp()
        up = self.read_raw_pressure()

        # You can use the datasheet values to test the conversion results
        # dsValues = True
        dsvalues = False

        if (dsvalues):
            ut = 27898
            up = 23843
            self._cal_AC6 = 23153
            self._cal_AC5 = 32757
            self._cal_MB = -32768
            self._cal_MC = -8711
            self._cal_MD = 2868
            self._cal_B1 = 6190
            self._cal_B2 = 4
            self._cal_AC3 = -14383
            self._cal_AC2 = -72
            self._cal_AC1 = 408
            self._cal_AC4 = 32741
            self.mode = self.__BMP085_ULTRALOWPOWER
            if (self.debug):
                self.show_calibration_data()

        # True Temperature Calculations
        x1 = ((ut - self._cal_AC6) * self._cal_AC5) >> 15
        x2 = (self._cal_MC << 11) / (x1 + self._cal_MD)
        b5 = x1 + x2
        if (self.debug):
            print "DBG: X1 = %d" % (x1)
            print "DBG: X2 = %d" % (x2)
            print "DBG: B5 = %d" % (b5)
            print "DBG: True Temperature = %.2f C" % (((b5 + 8) >> 4) / 10.0)

        # Pressure Calculations
        b6 = b5 - 4000
        x1 = (self._cal_B2 * (b6 * b6) >> 12) >> 11
        x2 = (self._cal_AC2 * b6) >> 11
        x3 = x1 + x2
        b3 = (((self._cal_AC1 * 4 + x3) << self.mode) + 2) / 4
        if (self.debug):
            print "DBG: B6 = %d" % (b6)
            print "DBG: X1 = %d" % (x1)
            print "DBG: X2 = %d" % (x2)
            print "DBG: X3 = %d" % (x3)
            print "DBG: B3 = %d" % (b3)

        x1 = (self._cal_AC3 * b6) >> 13
        x2 = (self._cal_B1 * ((b6 * b6) >> 12)) >> 16
        x3 = ((x1 + x2) + 2) >> 2
        b4 = (self._cal_AC4 * (x3 + 32768)) >> 15
        b7 = (up - b3) * (50000 >> self.mode)
        if (self.debug):
            print "DBG: X1 = %d" % (x1)
            print "DBG: X2 = %d" % (x2)
            print "DBG: X3 = %d" % (x3)
            print "DBG: B4 = %d" % (b4)
            print "DBG: B7 = %d" % (b7)

        if (b7 < 0x80000000):
            p = (b7 * 2) / b4
        else:
            p = (b7 / b4) * 2

        if (self.debug):
            print "DBG: X1 = %d" % (x1)

        x1 = (p >> 8) * (p >> 8)
        x1 = (x1 * 3038) >> 16
        x2 = (-7357 * p) >> 16
        if (self.debug):
            print "DBG: p  = %d" % (p)
            print "DBG: X1 = %d" % (x1)
            print "DBG: X2 = %d" % (x2)

        p = p + ((x1 + x2 + 3791) >> 4)
        if (self.debug):
            print "DBG: Pressure = %d Pa" % (p)

        return p

    def read_altitude(self, sea_level_pressure=101325):
        """Calculates the altitude in meters"""
        pressure = float(self.read_pressure())
        altitude = 44330.0 * (1.0 - pow(pressure / sea_level_pressure, 0.1903))
        if (self.debug):
            print "DBG: Altitude = %d" % (altitude)
        return altitude