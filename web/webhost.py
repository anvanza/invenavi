import sys
import logging
import threading
import json

from twisted.python import log
from twisted.internet import reactor, defer
from twisted.web.server import Site
from twisted.web.static import File

from autobahn.twisted.websocket import listenWS
from autobahn.wamp1.protocol import exportRpc, \
						  WampServerFactory, \
						  WampServerProtocol
class RPCProtos:
    def __init__(self, kernel):
        logging.info("RPC:\tprotos init.")
        self._kernel = kernel

    @exportRpc
    def set_throttle(self, throttle):
        self._kernel.set_throttle(throttle)
        return self.data()

    @exportRpc
    def set_steering(self, steering):
        self._kernel.set_steering(steering)
        return self.data()

    @exportRpc
    def data(self):
        self._kernel.update()
        return {
            'lat': self._kernel.data.lat,
            'lon': self._kernel.data.lon,
            'temp' : self._kernel.data.temperature ,
            'press' : self._kernel.data.pressure ,
            'heading' : self._kernel.data.compass_heading
        }

    @exportRpc
    def enable_nav(self):
        threading.Thread(target=self._kernel.run_navigation()).start()
        return self.data()

    @exportRpc
    def waypoints(self, data):
        waypoints = json.loads(data)
        self._kernel.clear_points()
        
        for waypoint in waypoints:
            self._kernel.add_point(waypoint[0],waypoint[1])
        return self.data()

    @exportRpc
    def disable_nav(self):
        self._kernel._navigationCanRun = False
        return self.data()

class RPCProtocol(WampServerProtocol):
    def onClose(self, wasClean, code, reason):
        logging.info("RPC:\t"+str(reason))

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
