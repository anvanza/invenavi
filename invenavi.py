import logging
import sys
import MySQLdb

from config import invenaviConfig
from kernel import invenaviKernel

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
  
  def run_headless(self):
    # wait for commands...
    logging.info("invenavi:\tWaiting for commands...")
    
    # run internal webhost
    import web.webhost
    web.webhost.run_main_host(kernel, self.config.rpc_port)
    logging.info("invenavi:\tProgram complete - exiting.")
  
    #done
    return 0
    
def main():
    invenavi = Invenavi()
    return invenavi.run()

if __name__ == "__main__":
    status = main()
    sys.exit(status)
