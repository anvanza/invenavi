#!/usr/bin/env bash

apt-get update
apt-get install gpsd gpsd-clients python-gps python-smbus i2c-tools python-dev
pip install pyserial pynmea autobahn[twisted]