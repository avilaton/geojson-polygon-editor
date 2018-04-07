from flask import Blueprint, render_template

web = Blueprint('web', __name__)


@web.route('/')
def index():
    return render_template('index.html')


@web.route('/editor/<layer_id>')
def editor(layer_id):
    print(layer_id)
    return render_template('editor.html', layer_id=layer_id)
