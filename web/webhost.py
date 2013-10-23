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
   def __init__(self, kernel):
      logging.info("RPC:\tprotos init.")
      self._kernel = kernel

   @exportRpc
   def set_drive(self, throttle, steering):
      """ Direct drive. """
      # throttle
      self._kernel.set_throttle(throttle)
      # steering
      self._kernel.set_steering(steering)

      return {'status':True}

   @exportRpc
   def data(self):
      self._kernel.update()

      return {'lat': self._kernel.data.lat, 'lon': self._kernel.data.lon}

class RPCProtocol(WampServerProtocol):
   def onClose(self, wasClean, code, reason):
      logging.info("RPC:\t"+reason)

   def onSessionOpen(self):
      self.registerForRpc(self.protos, "http://10.0.0.142/ws/protos#")
      logging.info("RPC:\tnew connection.")

def run_main_host(kernel, rpc_port):

   log.startLogging(sys.stdout)
   factory = WampServerFactory("ws://localhost:9000", debugWamp = True)
   factory.protocol = RPCProtocol
   factory.protocol.protos = RPCProtos(kernel)
   factory.setProtocolOptions(allowHixie76 = True)
   listenWS(factory)

   webdir = File(".")
   web = Site(webdir)
   reactor.listenTCP(8080, web)

   reactor.run()
