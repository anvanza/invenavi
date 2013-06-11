import sys
import logging

from twisted.python import log
from twisted.internet import reactor, defer
from twisted.web.server import Site
from twisted.web.static import File

from autobahn.websocket import listenWS
from autobahn.wamp import exportRpc, \
                          WampServerFactory, \
                          WampServerProtocol
class RPCProtos:
   def __init__(self):
      logging.info("RPC:\tprotos init.")

   @exportRpc
   def sayhello(self, msg):
      return ("hello " + msg)
   @exportRpc
   def set_drive(self, throttle, steering):
      """ Direct drive. """
      # throttle
      self._kernel.set_throttle(throttle)
      # steering
      self._kernel.set_steering(steering)
      
      return {'status':True}

class RPCProtocol(WampServerProtocol):
   def onClose(self, wasClean, code, reason):
      logging.info("RPC:\t"+reason)
   
   def onSessionOpen(self):
      self.protos = RPCProtos()
      self.registerForRpc(self.protos, "http://10.0.0.141/ws/protos#")
      logging.info("RPC:\tnew connection.")
                            
def run_main_host(kernel, rpc_port):

   log.startLogging(sys.stdout)
   factory = WampServerFactory("ws://localhost:9000", debugWamp = True)
   factory.protocol = RPCProtocol("helloworx")
   factory.setProtocolOptions(allowHixie76 = True)
   listenWS(factory)

   webdir = File(".")
   web = Site(webdir)
   reactor.listenTCP(8080, web)

   reactor.run()