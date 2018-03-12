from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Layer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    geojson = db.Column(db.Text)
