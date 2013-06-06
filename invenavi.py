import logging
import sys

class Invenavi:
  """first setup"""
  
  def __init__(self):
    logging.basicConfig(filename='logging.log',level=logging.DEBUG)
    
    #say we're launching
    logging.info("invenavi ready to initialize..")
    
    while true:
      print "hello"
    
def main():
    invenavi = Invenavi()

if __name__ == "__main__":
    status = main()
    sys.exit(status)
