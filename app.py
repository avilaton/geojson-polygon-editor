import os
from flask import Flask, jsonify, send_from_directory, send_file
app = Flask(__name__)


@app.route('/data/')
def layers():
    items = []
    for f in os.listdir('./data/'):
        filename, extension = os.path.splitext(f)
        if extension.endswith(".geojson"):
            items.append({"filename":f})
    return jsonify({"items": items})


@app.route('/data/<path:filename>')
def layer(filename):
    return send_from_directory('./data/', filename)


@app.route('/<path:filename>')
def statics(filename):
    return send_from_directory('./', filename)


@app.route('/')
def index():
    return send_file('./index.html')


@app.route('/editor.html')
def editor():
    return send_file('./editor.html')


if __name__ == "__main__":
    app.run()
