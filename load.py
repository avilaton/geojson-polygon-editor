import os
import json
from geojson_editor.database import db, Layer


DATA_DIR = './data/'
EXT = '.geojson'


def load_layer_names():
    layers = []
    for f in os.listdir(DATA_DIR):
        filename, extension = os.path.splitext(f)
        if extension.endswith(EXT):
            layers.append(filename)
    return layers


def load_layer(name):
    with open(DATA_DIR + name + EXT) as layer_file:
        payload = json.loads(layer_file.read())
    return payload


def main():
    db.drop_all()
    db.create_all()
    layer_names = load_layer_names()

    for layer_name in layer_names:
        layer = Layer(name=layer_name)
        payload = load_layer(layer_name)
        layer.geojson = json.dumps(payload, separators=(',', ':'))
        db.session.add(layer)
    db.session.commit()


if __name__ == '__main__':
    main()
