import logging
import sys
import argparse

from config import invenaviConfig
from kernel import invenaviKernel

class InvenaviRunMode:
    Manual = "manual"
    Remote = "remote"
    Auto = "auto"
    Modes = [Manual, Remote, Auto]

class Invenavi:
  """first setup"""

  config = invenaviConfig();

  def __init__(self):
    parser = argparse.ArgumentParser(description='invenavi')
    parser.add_argument("-m", "--mode", help="Operational Mode to run" , choices=InvenaviRunMode.Modes , default=InvenaviRunMode.Manual,action='store')
    parser.add_argument("-d", "--debug", help="Increase debugging information output" ,action='store_true')
    parser.add_argument("-s", "--server", help="Server for remote device", default="raspberrypi.local", type=str, action='store')
    parser.add_argument("-dp", "--devport", help="port for device rpc", default=8080, type=int, action='store')

    # and parse
    selected_args = parser.parse_args()
    self.debug = selected_args.debug
    self.selected_mode = selected_args.mode
    self.config.server_name = selected_args.server
    self.config.rpc_port = selected_args.devport

    #say we're launching
    logging.info("invenavi:\tinvenavi ready to initialize..")

  def configure_devices(self):
    """ Configures eg i2c and other attached devices."""
    self.config.configure_devices(self.debug)

  def run(self):
    # configure
    self.configure_devices()

    # create controller
    kernel = invenaviKernel(self.config, debug=self.debug)

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
