#!/usr/bin/env python3
"""This file is the Flask launcher."""

import logging
from os import path

from flask import Flask, request, render_template
from flask_socketio import SocketIO
from flask_restful import Api
from flask_cors import CORS

from lib.rest.device import RESTDevice, RESTCommand
from lib.rest.room import RESTRoom
from lib.structures.home import Home

from lib.common.database import Database
from lib.common.scheduler import schedule

ROOT = path.dirname(path.realpath(__file__))
logging.basicConfig(
	level=logging.NOTSET,
	filename=ROOT + '/debug.log',
	format='%(asctime)s from %(name)-35s %(levelname)-8s: %(message)s')

app = Flask(
	__name__,
	template_folder='../react/build',
	static_folder='../react/build/static'
)

api = Api(app)
socketio = SocketIO(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')


@app.teardown_request
def after_change(exception=None):
	if exception is None:
		if request.method in ['PUT', 'POST', 'DELETE']:
			socketio.emit('notify', namespace="/api/socket")


database = Database(__name__)
home = Home(__name__, database)

schedule(home.fetch_devices_states, 2, 'updating_devices_job', 'Updating home devices')
schedule(home.reload_home, 10, 'reload_home_job', 'Reloading home from database')

resource_args = {'database': database, 'home': home}
api.add_resource(RESTRoom, '/api/rooms', resource_class_kwargs=resource_args)
api.add_resource(RESTDevice, '/api/devices', resource_class_kwargs=resource_args)
api.add_resource(RESTCommand, '/api/command', resource_class_kwargs=resource_args)

if __name__ == '__main__':
	socketio.run(app)
