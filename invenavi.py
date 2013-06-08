import logging
import sys
import MySQLdb
import argparse

from config import invenaviConfig
from kernel import invenaviKernel

class Invenavi:
  """first setup"""
  
  config = invenaviConfig();
  
  def __init__(self):
    parser = argparse.ArgumentParser(description='invenavi')
    parser.add_argument("-d", "--debug", help="increase debugging information output", action='store_true')
    parser.add_argument("-s", "--server", help="server for remote device", default="raspberrypi.local", type=str, action='store')
    parser.add_argument("-dp", "--devport", help="port for device rpc", default=2040, type=int, action='store')
    parser.add_argument("-cp", "--camport", help="port for camera stream", default=8080, type=int, action='store')
    
    # TODO - add further arguments here
    #parser.add_argument(...)        
    
    # and parse
    selected_args = parser.parse_args()
    self.selected_mode = selected_args.mode
    self.debug = selected_args.debug
    self.config.server_name = selected_args.server
    self.config.rpc_port = selected_args.devport
    self.config.camera_port = selected_args.camport
        
    #say we're launching
    logging.info("invenavi:\tinvenavi ready to initialize..")
    
    db = MySQLdb.connect(host="localhost",user="root",passwd="raspberry", db="test")
    
  def run(self):
    """Run the selected mode"""
    logging.info("invenavi:\tStarting invenavi in mode: headless")
    return self.run_headless()
  
  def run_headless(self):
    # configure
    #self.configure_devices()

    # create controller
    kernel = invenaviKernel(self.config, debug=self.debug)

    # testing
    #kernel.list_devices()
        
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
