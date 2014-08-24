import sys
sys.path.append("/home/pi/invenavi")
from sensor.Adafruit_LSM303DLHC import LSM303DLHC

debug = true

compass_sensor = LSM303DLHC(0x19, 0x1E, debug)
compass_sensor.set_temp_enabled(True)

while True:
    print compass_sensor.read_magnetic_heading()