#!/usr/bin/python

import json
import os
import cgi

class storage(object):
	"""a simple naive file storage"""
	def __init__(self, dir):
		self.dir = dir

	def jsonPrint(self, data):
		print "Content-Type: application/json\n\n"
		print json.dumps(data,indent=1)

	def ls(self, fmt):
		dirListing = os.listdir(self.dir)
		result = []
		for f in dirListing:
			filename, extension = os.path.splitext(f)
			if extension.endswith(".geojson"):
				result.append(f)

		self.jsonPrint({"files": result})

	def get(self, filename):
		with open(self.dir + filename) as f:
			content = json.loads(f.read())
		self.jsonPrint(content)

	def save(self, filename):
		with open(self.dir + filename) as f:
			content = json.loads(f.read())
		return

def main():
	dataStore = storage("./data/")

	form = cgi.FieldStorage()
	action = form.getvalue('action')
	if action == 'list':
		dataStore.ls(".json")

	elif action == 'get':
		filename = form.getvalue('filename')
		dataStore.get(filename)
		pass
	elif action == 'save':
		jsonPrint("file saved")

if __name__ == "__main__":
	main()
