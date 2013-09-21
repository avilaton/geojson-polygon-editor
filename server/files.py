#!/usr/bin/python

import json
import os

class storage(object):
	"""a simple naive file storage"""
	def __init__(self, dir):
		self.dir = dir

	def ls(self, fmt):
		dirListing = os.listdir(self.dir)
		result = []
		for f in dirListing:
			filename, extension = os.path.splitext(f)
			if extension.endswith(".geojson"):
				result.append(f)
		return result

	def get(self, filename):
		with open(self.dir + filename) as f:
			content = json.loads(f.read())
		return content

	def save(self, filename, content):
		with open(self.dir + filename, 'w') as f:
			body = json.dumps(content, indent=4)
			f.write(body)
		return True

def main():
	dataStore = storage("./data/")

	print dataStore.ls(".json")

if __name__ == "__main__":
	main()
