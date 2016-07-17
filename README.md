# GeoJSON polygon editor

## Setup

We use bower to get javascript dependencies. Run

	bower install

to get all javascript libraries you will need.

Also create a virtualenv using `mkvirtualenv geojson-polygon-editor` and install
dependencies using `pip install -r requirements.txt`.

## Run

Start a dev server by running

	$ export FLASK_APP=app.py
	$ flaks run

and point your browser to [http://localhost:5000](http://localhost:5000).
