import os
from flask import Flask
from geojson_editor.database import db
from geojson_editor.views import bp as blueprint


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///database.sqlite')
    db.init_app(app)
    app.register_blueprint(blueprint)
    return app
