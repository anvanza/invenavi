import logging
import logging.handlers

import os
import time

class invenaviConfig(object):

    _root_dir = os.path.join(os.getenv("HOME"), "invenavi")

    def __init__(self):
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)
        console = logging.StreamHandler()
        logger.addHandler(console)
        
        # create directory
        if not os.path.exists(self.logs_path):
            os.makedirs(self.logs_path)

        # add file logging
        log_file_stem = os.path.join(self.logs_path, 'invenavi_%s.log' % time.strftime('%Y%m%d_%H%M%S'))
        handler = logging.handlers.RotatingFileHandler(log_file_stem, backupCount=50)
        formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        

    @property
    def logs_path(self):
        return os.path.join(self._root_dir, "logs")
