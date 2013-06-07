import logging
import sys
import MySQLdb

class Invenavi:
  """first setup"""
  
  config = invenaviConfig();
  
  def __init__(self):
    
    #say we're launching
    logging.info("invenavi:\tinvenavi ready to initialize..")
    
    db = MySQLdb.connect(host="localhost",user="root",passwd="raspberry", db="test")
    
  def run(self):
    """Run the selected mode"""
    logging.info("invenavi:\tStarting invenavi in mode: headless")
    return self.run_headless()
  
  def run_headless():
    # wait for commands...
    logging.info("invenavi:\tWaiting for commands...")
    
    #start the server
    pass
  
    #done
    return 0
    
def main():
    invenavi = Invenavi()
    return invenavi.run()

if __name__ == "__main__":
    status = main()
    sys.exit(status)
