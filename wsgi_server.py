#!/usr/bin/python
# -*- coding: utf-8 -*-

from server import storage

if __name__ == "__main__":
    storage.app.run(host='localhost', port=8003, debug=True, reloader=True)
