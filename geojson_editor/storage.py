import os
import json
from flask import current_app, request
from geojson_editor.database import db, Layer

STORAGE = 'filesystem'
STORAGE = 'db'


def get_layers():
    items = []
    if STORAGE == 'db':
        query = db.session.query(Layer).all()
        for layer in query:
            items.append({"filename": layer.name + '.geojson'})
    else:
        for f in os.listdir('./geojson_editor/data/'):
            filename, extension = os.path.splitext(f)
            if extension.endswith(".geojson"):
                items.append({"filename": f})
    return items


def save_layer(filename, payload):
    if STORAGE == 'db':
        layer_name, extension = os.path.splitext(filename)
        layer = db.session.query(Layer).filter_by(name=layer_name).first()
        layer.geojson = json.dumps(payload)
        db.session.commit()
        return payload
    else:
        with open('./geojson_editor/data/' + filename, 'w') as f:
            body = json.dumps(payload, indent=2)
            f.write(body)
        return get_layer(filename)


def get_layer(filename):
    if STORAGE == 'db':
        layer_name, extension = os.path.splitext(filename)
        layer = db.session.query(Layer).filter_by(name=layer_name).first()
        payload = json.loads(layer.geojson)
        return payload
    else:
        with current_app.open_resource('./data/' + filename, 'r') as res:
            contents = json.loads(res.read())
            return contents
