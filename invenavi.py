import logging
import sys

logging.info("invenavi program started")

class Invenavi:
  """first setup"""
  
  def __init__(self):
    
    #say we're launching
    logging.info("invenavi ready to initialize..")
    
def main():
    invenavi = Invenavi()

if __name__ == "__main__":
    status = main()
    sys.exit(status)
