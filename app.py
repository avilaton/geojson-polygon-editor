import os
import json
from flask import Flask, jsonify, send_from_directory, request, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite'
db = SQLAlchemy(app)

STORAGE = 'filesystem'
STORAGE = 'db'


class Layer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    geojson = db.Column(db.Text)


class Feature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    layer_id = db.Column(db.Integer, db.ForeignKey('layer.id'), nullable=False)
    layer = db.relationship('Layer', backref=db.backref('features',
                                                        lazy='dynamic'))
    geom = db.Column(db.Text)


@app.route('/data/')
def layers():
    items = []
    for f in os.listdir('./data/'):
        filename, extension = os.path.splitext(f)
        if extension.endswith(".geojson"):
            items.append({"filename": f})
    return jsonify({"items": items})


@app.route('/data/<path:filename>')
def get_layer(filename):
    if STORAGE == 'db':
        layer_name, extension = os.path.splitext(filename)
        layer = db.session.query(Layer).filter_by(name=layer_name).first()
        payload = json.loads(layer.geojson)
        return jsonify(payload)
    else:
        return send_from_directory('./data/', filename)


@app.route('/data/<path:filename>', methods=['PUT'])
def save_layer(filename):
    payload = request.get_json()

    if STORAGE == 'db':
        layer_name, extension = os.path.splitext(filename)
        layer = db.session.query(Layer).filter_by(name=layer_name).first()
        layer.geojson = json.dumps(payload)
        db.session.commit()
        return jsonify(payload)
    else:
        with open('./data/' + filename, 'w') as f:
            body = json.dumps(payload, indent=2)
            f.write(body)
        return send_from_directory('./data/', filename)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/editor.html')
def editor():
    return render_template('editor.html')


if __name__ == "__main__":
    app.run()
