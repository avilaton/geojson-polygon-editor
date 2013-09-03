#!/usr/bin/python

import json
import os

import cgi


def jsonPrint(data):
	print "Content-Type: application/json\n\n"
	print json.dumps(data,indent=1)

def ls(dir, fmt):
	dirListing = os.listdir(dir)
	result = []
	for f in dirListing:
		filename, extension = os.path.splitext(f)
		if extension == ".geojson":
			result.append(f)
	return {"files": result}

def main():
	form = cgi.FieldStorage()
	action = form.getvalue('action')
	if action == 'list':
		dirListing = os.listdir('./data')
		result = ls('./data','json')
		return jsonPrint(result)
	elif action == 'get':
		jsonPrint("here is your file")
	elif action == 'save':
		jsonPrint("file saved")

if __name__ == "__main__":
	main()
