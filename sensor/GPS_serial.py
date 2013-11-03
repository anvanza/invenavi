#!/usr/bin/python

#  - Standard sense gives:
#    - fix, lat, lon, heading, speed, altitude, num_sat, timestamp, datestamp


from datetime import datetime
import logging
import serial
from pynmea import nmea

class GPS_sensor:
    """ GPS Navigatron over serial port. """

    # different commands to set the update rate from once a second (1 Hz) to 10 times a second (10Hz)
    PMTK_SET_NMEA_UPDATE_1HZ = '$PMTK220,1000*1F'
    PMTK_SET_NMEA_UPDATE_5HZ = '$PMTK220,200*2C'
    PMTK_SET_NMEA_UPDATE_10HZ = '$PMTK220,100*2F'

    # baud rates
    PMTK_SET_BAUD_57600 = '$PMTK250,1,0,57600*2C'
    PMTK_SET_BAUD_9600 = '$PMTK250,1,0,9600*17'

    # turn on GGA
    PMTK_SET_NMEA_OUTPUT_GGA = '$PMTK314,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*29'


    #  how long to wait when we're looking for a response
    MAXWAITSENTENCE = 5

    def __init__(self, serial_bus="/dev/ttyAMA0", baud=9600, debug=False):
        self.debug = debug
        self._GPS = serial.Serial(serial_bus, baud)
        self._GPS.write(self.PMTK_SET_NMEA_UPDATE_5HZ)
        self._GPS.write(self.PMTK_SET_BAUD_9600)
        self._GPS.write(self.PMTK_SET_NMEA_OUTPUT_GGA)
        self._GPS.flush()

    def read_sensor(self):
        """ Reads GPS and returns (fix, lat, lon, heading, speed, altitude, num_sat, timestamp, datestamp). """
        if not(self._GPS.inWaiting()):
            return self.zero_response()

        # read gps gga (fix data) packet
        has_read_gga, gps_gga = self.wait_for_sentence('$GPGGA')
        if not(has_read_gga):
            return self.zero_response()
        if not(gps_gga.gps_qual > 0):
            return self.zero_response()
        if not(gps_gga.latitude) or not(gps_gga.longitude):
            return self.zero_response()

        fix = gps_gga.gps_qual
        lat = gps_gga.latitude
        lon = gps_gga.longitude
        altitude = gps_gga.antenna_altitude
        num_sat = gps_gga.num_sats
        timestamp = datetime.strptime(gps_gga.timestamp.rstrip('.000'), "%H%M%S").time()

        return fix, lat, lon, altitude, num_sat, timestamp

    def zero_response(self):
        dt = datetime.today()
        return 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, dt.time(), dt.date()

    def wait_for_sentence(self, wait4me):
        i = 0;
        while (i < self.MAXWAITSENTENCE):
            i += 1
            if self._GPS.inWaiting():
                line = self._GPS.readline()
                if line.startswith(wait4me):
                    if line.startswith('$GPGGA'):
                        logging.debug("SENSOR:\tGPS_serial:\tReceived GPGGA: %s", line)
                        p = nmea.GPGGA()
                        p.parse(line)
                        return True, p

        return False, None

