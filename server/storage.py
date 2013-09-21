#!/usr/bin/env python

DEBUG = False

from bottle import route, static_file, get, post, put, request, redirect, response

import files

dataStore = files.storage("./data/")


# static routes, should be coded more elegantly...

@route('/')
def index():
  return static_file('index.html',root='./')

@route('/editor.html')
def index():
  return static_file('editor.html',root='./')

@route('/js/<filepath:path>')
def server_files(filepath):
  return static_file(filepath, root='./js/')

@route('/bower_components/<filepath:path>')
def server_files(filepath):
  return static_file(filepath, root='./bower_components/')

@route('/stylesheets/<filepath:path>')
def server_files(filepath):
  return static_file(filepath, root='./stylesheets/')

@route('/templates/<filepath:path>')
def server_files(filepath):
  return static_file(filepath, root='./templates/')

@route('/data/<filepath:path>')
def server_files(filepath):
  return static_file(filepath, root='./data/')


# API calls

@route('/data')
@route('/data/')
def files():
  items = [{"filename":filename} for filename in dataStore.ls(".json")]
  return {"items": items}

@put('/data/<filepath:path>')
def updateFile(filepath):
  content = request.json
  dataStore.save(filepath, content)
  return 


@route('/api/stop/<stop_id>')
def findStop(stop_id):
  return tb.findStop(stop_id)

@put('/api/stop/<stop_id>')
def updateStop(stop_id):
  return tb.updateStop(stop_id, request.json)




import bottle

bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024

if DEBUG == True:
  bottle.debug(True)

app = bottle.app()

if __name__ == '__main__':
  app.run(server='cgi')
