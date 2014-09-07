import time
import logging
from Point import Point
from Bearing import Bearing

class Navigation:
	def __init__(self, kernel, points=None):
		self._kernel = kernel
		self._refreshRate = 1
		self._currentWaypoint = 0
		self._points = points if points is not None else []

	def run(self):
		logging.info("Navigation:\t nav init.")
		self._kernel._navigationCanRun = True

		#give an early return
		if(len(self._points) == 0):
			logging.info("Navigation:\t no points available.")
			self._kernel._navigationCanRun = False
			return False

		while 1:
			self._kernel.update()

			#check if we got a point
			if(self.current):
				loc = Point(float(self._kernel.data.lat), float(self._kernel.data.lon))
				#calculate the bearing
				bearing = loc.bearing_to(self.current)
				# calculate the distance
				distance = loc.distance_to(self.current)

				if(distance < 1):
					# when the distance is within a certain meters , go to next point
					self.set_next()
					# keep it slow 10%
					self._kernel.set_throttle(0.1)
					# update faster
					self._refreshRate = 1
				elif(distance < 10):
					# start to slow down 30%
					self._kernel.set_throttle(0.3)
					# update faster we're getting close
					self._refreshRate = 1
				elif(distance < 50):
					# keep power around 50%
					self._kernel.set_throttle(0.5)
					# were some distance
					self._refreshRate = 3
				else:
					# power can go hard!
					self._kernel.set_throttle(1)
					# we're saving on refresh
					self._refreshRate = 5

				if(bearing): #TODO check if bearing is off by 10 degrees before moving the servo to save power
					self._kernel.set_steering(int(bearing))

			else:
				#check if there are any point available
				pass

			#check if we may continue to run
			if(self._kernel._navigationCanRun):
				time.sleep(self._refreshRate) #sleep to save power
			else:
				break

	@property
	def current(self):
		"""Return the next waypoint"""
		return self._points[self._currentWaypoint]

	def add_point(self, lat , lon):
		self._points += [Point(float(lat), float(lon))]

	def clear_points(self):
		self._points = None

	def get_waypoint(self, n):
		"""Return the waypoint n places along the path"""
		return self._points[n]

	def set_next(self):
		"""Assign the next waypoint to the subsequent point in the list"""
		self._currentWaypoint = min(self._currentWaypoint + 1, len(self._points) - 1)