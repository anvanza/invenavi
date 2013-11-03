import sys
import logging
import subprocess

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
      #take picture
      subprocess.call(["raspistill", "-o" , "invenavi.jpg" , "-q" , "100" ,"-w" , "300" , "-h", "300" , "-rot" , "180" ,"-tl" , "1000"])

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

   @exportRpc
   def picture(self):
      #send it with base64
      with open("invenavi.jpg", "rb") as f:
         data = f.read()
         return {"image": data.encode("base64")}

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
