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
put_parser.add_argument('id', type=str, help='Device id is missing', required=True)
put_parser.add_argument('room', type=str, help='Device room is missing', required=True)
put_parser.add_argument('name', type=str, help='Device name is missing', required=True)
put_parser.add_argument('address', type=str, help='Device address is missing', required=True)
put_parser.add_argument('category', type=str, help='Device category is missing', required=True)

# DELETE arguments
delete_parser = reqparse.RequestParser()
delete_parser.add_argument('id', type=str, help='Device id is missing', required=True)
delete_parser.add_argument('room', type=str, help='Device room is missing', required=True)


class RESTDevice(REST):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def post(self):
		arguments = post_parser.parse_args(strict=True)

		response = {'duplicate': False}

		room_id = arguments['room']
		device_information = Device.crop_information(arguments)

		try:
			device_id = self._database.insert_device(device_information, room_id)
			device_information['id'] = device_id
			response['id'] = device_id

			new_device = Device(device_information)
			new_device.get_state()

			self._home.append_device_to_room(new_device, room_id)
		except MongoErrors.DuplicateKeyError:
			response['duplicate'] = True

		return response

	def put(self):
		arguments = put_parser.parse_args(strict=True)
		return arguments

	def delete(self):
		arguments = delete_parser.parse_args(strict=True)
		room_id = arguments['room']
		device_id = arguments['name']

		self._database.delete_device(device_id, room_id)
		self._home.remove_device_from_room(device_id, room_id)

		return {}


# PUT arguments
command_parser = reqparse.RequestParser()
command_parser.add_argument('id', type=str, help='Device name is missing', required=True)
command_parser.add_argument('room', type=str, help='Device room is missing', required=True)
command_parser.add_argument('command', type=str, help='Device command')


class RESTCommand(REST):
	@staticmethod
	def interpret_command(device, command):
		if command == 'turn_on' or command == 'on':
			return device.turn_on()
		elif command == 'turn_off' or command == 'off':
			return device.turn_off()
		elif command == 'toggle':
			return device.toggle()
		else:
			return device.get_state()

	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def put(self):
		arguments = command_parser.parse_args(strict=True)
		room_id = arguments['room']
		device_id = arguments['id']

		device = self._home.get_device_from_room(device_id, room_id)

		response = {'state': ''}
		if device is not None:
			response['state'] = self.interpret_command(device, arguments['command'])

		return response
