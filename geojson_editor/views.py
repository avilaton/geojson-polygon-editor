from flask import Blueprint, render_template, jsonify, request
from geojson_editor import storage

bp = Blueprint('main', __name__)


@bp.route('/data/')
def layers():
    items = storage.get_layers()
    return jsonify({"items": items})


@bp.route('/data/<path:filename>')
def layer_get(filename):
    payload = storage.get_layer(filename)
    return jsonify(payload)


@bp.route('/data/<path:filename>', methods=['PUT'])
def layer_update(filename):
    payload = request.get_json()
    result = storage.save_layer(filename, payload)
    return jsonify(result)


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/editor.html')
def editor():
    return render_template('editor.html')
