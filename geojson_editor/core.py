import os
from flask import Flask
from geojson_editor.database import db
from geojson_editor.views.api import api
from geojson_editor.views.web import web


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///database.sqlite')
    db.init_app(app)
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(web)
    return app
