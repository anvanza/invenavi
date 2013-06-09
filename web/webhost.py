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

from autobahn.resource import WebSocketResource, HTTPChannelHixie76Aware

class RPCProtocol(WampServerProtocol):
   def __init__(self):
      logging.debug("RPC:\tprotocol created.")
      
   def onOpen(connectionRequest):
       logging.info("RPC:\tnew connection: ")
   
   def onClose(self, wasClean, code, reason):
       logging.info("RPC:\t"+reason)
   
   def onSessionOpen(self):
      self.registerForRpc(self, "http://10.0.0.141/ws/rpc#")
      
   @exportRpc
   def sayhello(self, msg):
      return ("hello " + msg) 

class RPCHost(WampServerFactory):

   protocol = RPCProtocol

   def __init__(self, url):
      WampServerFactory.__init__(self, url)
        
   def onMessage(self, msg, binary):
      self.sendMessage(msg, binary)
                            

def run_main_host(kernel, rpc_port):
   factory = RPCHost("ws://localhost:9000")
   listenWS(factory)
   reactor.run()



