from flask import Blueprint, render_template, jsonify, request
from geojson_editor import storage

api = Blueprint('api', __name__)


@api.route('/layers.json')
def layers():
    items = storage.get_layers()
    return jsonify({"items": items})


@api.route('/layers/<path:filename>')
def layer_get(filename):
    payload = storage.get_layer(filename)
    return jsonify(payload)


@api.route('/layers/<path:filename>', methods=['PUT'])
def layer_update(filename):
    payload = request.get_json()
    result = storage.save_layer(filename, payload)
    return jsonify(result)
