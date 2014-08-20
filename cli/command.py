import sys
import logging


def test():
    print "OMG, it works..."

def other():
    print "I can call multiple functions"

# This will be to handle input for a function we don't have
def fail():
    print "You gave a bad function name.  I only know about %s" % (", ".join(funcs.keys()))

#dictonary
funcs = {"test": test, "other": other}

def run(kernel):
    while 1:
        try:
            var = raw_input("Please a command: ").strip()
            logging.info("CLI:\tnew command:%s" % var)
            funcs.get(var, fail)()
        except KeyboardInterrupt:
            logging.info("CLI:\tnew command: exit")
            break