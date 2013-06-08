import sys

from twisted.internet import reactor
from twisted.python import log
from twisted.web.server import Site
from twisted.web.static import File

from autobahn.websocket import WebSocketServerFactory, \
                               WebSocketServerProtocol

from autobahn.resource import WebSocketResource, HTTPChannelHixie76Aware


class EchoServerProtocol(WebSocketServerProtocol):

   def onMessage(self, msg, binary):
      self.sendMessage(msg, binary)

   def onOpen(connectionRequest):
       logging.info("WS:\tinvenavi welcomes a new connection")                               

def run_main_host(kernel, rpc_port):

   debug = True

   factory = WebSocketServerFactory("ws://localhost:" + str(rpc_port))

   factory.protocol = EchoServerProtocol

   resource = WebSocketResource(factory)

   ## we server static files under "/" ..
   root = File(".")

   ## and our WebSocket server under "/ws"
   root.putChild("ws", resource)

   ## both under one Twisted Web Site
   site = Site(root)
   reactor.listenTCP(8080, site)

   reactor.run()



