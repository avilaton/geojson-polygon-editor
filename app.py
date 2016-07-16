import os
import json
from flask import Flask, jsonify, send_from_directory, send_file, request


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
def get_layer(filename):
    return send_from_directory('./data/', filename)


@app.route('/data/<path:filename>', methods=['PUT'])
def save_layer(filename):
    payload = request.get_json()
    with open('./data/' + filename, 'w') as f:
        body = json.dumps(payload, indent=2)
        f.write(body)
    return jsonify(payload)


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
