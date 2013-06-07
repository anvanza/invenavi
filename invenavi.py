import logging
import sys
import MySQLdb

class Invenavi:
  """first setup"""
  
   config = invenaviConfig();
  
  def __init__(self):
    
    #say we're launching
    logging.info("invenavi ready to initialize..")
    
    db = MySQLdb.connect(host="localhost",user="root",passwd="raspberry", db="test")
    
def main():
    invenavi = Invenavi()

if __name__ == "__main__":
    status = main()
    sys.exit(status)
