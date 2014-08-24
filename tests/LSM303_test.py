import sys
import time

sys.path.append("/home/pi/invenavi")
from sensor.Adafruit_LSM303DLHC import LSM303DLHC

debug = False

compass_sensor = LSM303DLHC(0x19, 0x1E, debug)
compass_sensor.set_temp_enabled(True)
compass_sensor.set_accelerometer_low_power_mode(False)
compass_sensor.set_accelerometer_high_resolution(True)


while True:
    print compass_sensor.read_magnetic_heading()
    time.sleep(1000)