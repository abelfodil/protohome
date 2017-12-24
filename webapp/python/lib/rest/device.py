from flask_restful import reqparse
from pymongo import errors as MongoErrors

from lib.rest.general import REST
from lib.structures.device import Device

# POST arguments
post_parser = reqparse.RequestParser()
post_parser.add_argument('name', type=str, help='Device name is missing', required=True)
post_parser.add_argument('room', type=str, help='Device room is missing', required=True)
post_parser.add_argument('address', type=str, help='Device address is missing', required=True)
post_parser.add_argument('category', type=str, help='Device category is missing', required=True)

# PUT arguments
put_parser = reqparse.RequestParser()
put_parser.add_argument('name', type=str, help='Device name is missing', required=True)
put_parser.add_argument('room', type=str, help='Device room is missing', required=True)
put_parser.add_argument('command', type=str, help='Device command')

# DELETE arguments
delete_parser = reqparse.RequestParser()
delete_parser.add_argument('name', type=str, help='Device name is missing', required=True)
delete_parser.add_argument('room', type=str, help='Device room is missing', required=True)


class RESTDevice(REST):
	@staticmethod
	def interpret_command(device, command):
		if command == 'turn_on' or command == 'on':
			device.turn_on()
		elif command == 'turn_off' or command == 'off':
			device.turn_off()
		elif command == 'toggle':
			device.toggle()
		else:
			device.update()

	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def post(self):
		arguments = post_parser.parse_args(strict=True)

		response = {'duplicate': False}

		try:
			self._database.insert_device(arguments['room'], Device.crop_information(arguments))
		except MongoErrors.DuplicateKeyError:
			response['duplicate'] = True

		self._home.build_rooms()
		return response, 200

	def put(self):
		arguments = put_parser.parse_args(strict=True)

		response = {'state': ''}

		device = self._home.get_device_from_room(arguments['name'], arguments['room'])

		if device is not None:
			self.interpret_command(device, arguments['command'])
			response['state'] = device.get_state()

		return response, 200

	def delete(self):
		arguments = delete_parser.parse_args(strict=True)

		self._database.delete_device(arguments['room'], arguments['name'])

		self._home.build_rooms()
		return '', 204
