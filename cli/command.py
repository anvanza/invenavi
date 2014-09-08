import sys
import logging
import os
import threading

class Command:
	def __init__(self, kernel):
		logging.info("CLI:\tcommand init.")
		self._kernel = kernel

	def update(self):
		self._kernel.update()

	def halt(self):
		self._kernel.halt()

	def throttle(self):
		var = raw_input("How much throttle [0-100]: ").strip()
		self._kernel.set_throttle(var)

	def steering(self):
		var = raw_input("which angle [-180-180]: ").strip()
		self._kernel.set_steering(var)

	def enable_nav(self):
		#enable the automatic navigation of the boat
		logging.info("CLI:\tnav started.")
		threading.Thread(target=self._kernel.run_navigation).start()
	
	def disable_nav(self):
		logging.info("CLI:\tnav stopping.")
		self._kernel._navigationCanRun = False #fuck threading joins
	
	def add_point(self):
		lat = raw_input("Latitude: ").strip()
		lon = raw_input("Longitude: ").strip()
		self._kernel.add_point(lat, lon)
		logging.info("CLI:\tPoint added.")

	def thread_info(self):
		print "Active Threads : " + str(threading.activeCount())

def help():
	#we want it to look nice hu?
	print "-------------------|>---------------"
	print "-------------------|----------------"
	print "~~~~~~~~~~~~\INVENAVI/~~~~~~~~~~~~~~"
	print "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	print "update     : reads all the sensors"
	print "halt       : stop all motors/servo's"
	print "throttle   : set motor"
	print "steering   : set servo angle"
	print "add point  : add waypoint for nav"
	print "enablenav  : enable navigation"
	print "disablenav : disable navigation"
	print "threadinfo : show info about threads"
	print "takepicture: take a picture"
	print "____________________________________"
	print "to exit press ctrl+c"
	print ""

# This will be to handle input for a function we don't have
def fail():
	print "You gave a bad function name , type help!"

def run(kernel):
	comd = Command(kernel)
	#dictonary
	funcs = {"threadinfo" : comd.thread_info, "addpoint" : comd.add_point,  "update": comd.update, "throttle": comd.throttle, "steering": comd.steering, "halt": comd.halt, "enablenav": comd.enable_nav, "disablenav": comd.disable_nav, "help": help}

	while 1:
		try:
			var = raw_input("Command: ").strip()
			funcs.get(var, fail)()
		except KeyboardInterrupt:
			break