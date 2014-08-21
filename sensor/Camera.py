import logging
import subprocess

class CameraController:
	def __init__(self):
		try:
			subprocess.call(["raspistill", '--version']
		except OSError:
			return false

	def take_picture(self):
		subprocess.call(["raspistill", "-o" , "invenavi.jpg" , "-q" , "100" ,"-w" , "300" , "-h", "300" , "-rot" , "180" ,"-t" , "0"])
		logging.debug("CAM:\tCapture image.")
