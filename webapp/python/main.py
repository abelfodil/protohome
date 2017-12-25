#!/usr/bin/env python3
"""This file is the Flask launcher."""

import logging
from os import path

from flask import Flask, render_template, request
from flask_cors import CORS
from flask_restful import Api

from lib.rest.device import RESTDevice
from lib.rest.room import RESTRoom
from lib.structures.home import Home

from lib.common.database import Database
from lib.common.scheduler import schedule

ROOT = path.dirname(path.dirname(path.dirname(path.realpath(__file__))))
logging.basicConfig(
	filename=ROOT + '/debug.log',
	level=logging.NOTSET,
	format='%(asctime)s from %(name)-35s %(levelname)-8s: %(message)s')

app = Flask(__name__, template_folder='../react/build', static_folder='../react/build/static')
api = Api(app)
CORS(app)

database = Database(__name__)
home = Home(__name__, database)

schedule(home.update_rooms, 5, 'updating_devices_job', 'Updating home devices')


@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')


@app.teardown_request
def rebuild_home(exception=None):
	if exception is None:
		if request.method in ['POST', 'DELETE']:
			home.build_rooms()
			home.update_rooms()


resource_args = {'database': database, 'home': home}
api.add_resource(RESTRoom, '/api/rooms', resource_class_kwargs=resource_args)
api.add_resource(RESTDevice, '/api/devices', resource_class_kwargs=resource_args)

if __name__ == '__main__':
	app.run(host='0.0.0.0', use_reloader=False, debug=True)
