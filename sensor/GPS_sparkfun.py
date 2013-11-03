#
#	Python GPS Tracking Example
#	SparkFun Electronics, A.Weiss
#	Beerware: if you use this and meet me, you must buy me a beer
#
#	Function:
#	Takes GPS position and altitude data and plots it on a scaled map image of your
#	choice. Altitude can also be displayed in a separate graph.
#
#	The program has a console menu that allows you to configure your connection.
#	The program will run with either a GPS moudle connected or no moudle connected.
#	If a GPS is connected, the position and altitude data is automatically saved
#	to a file called nmea.txt. If no GPS is connected, you must create your own
#	nmea.txt and fill it with GPGGA NMEA sentences.
#	A map needs to be created and saved as a file called map.png. When you create
#	your map, note the lat and long of the bottom left and top right corner, in decimal
#	degrees. Then enter this information into the global variables below. This way,
#	your the border of your map image can be used as the graph mins and maxs.
#	Once you have a map loaded and a GPS connected, you can run the program and select
#	either your position to be displayed on your map, or display altitude on a separate
#	graph. The maps are not updated in realtime, so you must close the map and run
#	the map command again in order to read new data.

from pynmea import nmea
import serial, time, sys, threading, datetime, shutil, glob

######Global Variables#####################################################
# you must declare the variables as 'global' in the fxn before using#
ser = 0
lat = 0
long = 0
pos_x = 0
pos_y = 0
alt = 0
i = 0 #x units for altitude measurment

#adjust these values based on your location and map, lat and long are in decimal degrees
BAUDRATE = 9600
lat_input = 0            #latitude of home marker
long_input = 0           #longitude of home marker

######FUNCTIONS############################################################

def init_serial():

	#enter your COM port number
	comnum = '/dev/ttyAMA0' #concatenate COM and the port number to define serial port

	# configure the serial connections
	global ser, BAUDRATE
	ser = serial.Serial()
	ser.baudrate = BAUDRATE
	ser.port = comnum
	ser.timeout = 1
	ser.open()
	ser.isOpen()

	thread()

def position():
	#opens a the saved txt file, parses for lat and long, displays on map
	global lat, long, lat_input, long_input, pos_x, pos_y, altitude
	global BLX, BLY, TRX, TRY

	#same process here as in altitude
	f1 = open('temp.txt', 'w')
	f1.truncate()
	shutil.copyfile('nmea.txt', 'temp.txt')
	f1.close()

	f1 = open('temp.txt', 'r') #open and read only
	try:
		for line in f1:
			if(line[4] == 'G'): # $GPGGA
				if(len(line) > 50):
					#print line
					gpgga = nmea.GPGGA()
					gpgga.parse(line)
					lats = gpgga.latitude
					longs = gpgga.longitude

					#convert degrees,decimal minutes to decimal degrees
					lat1 = (float(lats[2]+lats[3]+lats[4]+lats[5]+lats[6]+lats[7]+lats[8]))/60
					lat = (float(lats[0]+lats[1])+lat1)
					long1 = (float(longs[3]+longs[4]+longs[5]+longs[6]+longs[7]+longs[8]+longs[9]))/60
					long = (float(longs[0]+longs[1]+longs[2])+long1)

					#calc position
					pos_y = lat
					pos_x = -long #longitude is negaitve


					#shows that we are reading through this loop
					print pos_x
					print pos_y
	finally:
		f1.close()

def save_raw():
	#this fxn creates a txt file and saves only GPGGA sentences
	while 1:
		line = ser.readline()
		line = str(line)
		if(line[4] == 'G'): # $GPGGA
			if(len(line) > 50):
				#print line
				gpgga = nmea.GPGGA()
				gpgga.parse(line)
				lats = gpgga.latitude
				longs = gpgga.longitude

				#convert degrees,decimal minutes to decimal degrees
				lat1 = (float(lats[2]+lats[3]+lats[4]+lats[5]+lats[6]+lats[7]+lats[8]))/60
				lat = (float(lats[0]+lats[1])+lat1)
				long1 = (float(longs[3]+longs[4]+longs[5]+longs[6]+longs[7]+longs[8]+longs[9]))/60
				long = (float(longs[0]+longs[1]+longs[2])+long1)

				#calc position
				pos_y = lat
				pos_x = -long #longitude is negaitve


				#shows that we are reading through this loop
				print pos_x
				print pos_y


########START#####################################################################################
init_serial()
position()
ser.close()
sys.exit()