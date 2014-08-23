import logging
import sys
import argparse

from config import InvenaviConfig
from kernel import InvenaviKernel

class InvenaviRunMode:
    #this class is bad , and I should feel bad!

    def __init__(self):
        pass

    Cli = "cli"
    Manual = "manual"
    Remote = "remote"
    Auto = "auto"
    Modes = [Manual, Remote, Auto, Cli]

class Invenavi:
  """first setup"""

  config = InvenaviConfig()

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
    """Run the selected mode"""
    logging.info("invenavi:\tStarting invenavi in mode {0}:".format(self.selected_mode))

    if self.selected_mode == InvenaviRunMode.Manual:
        return self.run_headless()
    elif self.selected_mode == InvenaviRunMode.Cli:
        return self.run_cli()
    else:
        logging.error("invenavi:\t Invalid mode! exiting")
        return 1

  def run_headless(self):

    # configure
    self.configure_devices()

    # create controller
    kernel = InvenaviKernel(self.config, debug=self.debug)

    # run internal webhost
    import web.webhost
    web.webhost.run_main_host(kernel, self.config.rpc_port)
    logging.info("invenavi:\tProgram complete - exiting.")

    #done
    return 0

  def run_cli(self):
    
    # configure
    self.configure_devices()

    # create controller
    kernel = InvenaviKernel(self.config, debug=self.debug)

    #run the cli mode
    import cli.command
    cli.command.run(kernel)

    #done
    return 0

def main():
    invenavi = Invenavi()
    return invenavi.run()

if __name__ == "__main__":
    status = main()
    sys.exit(status)
