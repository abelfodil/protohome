from flask_restful import reqparse

from lib.rest.general import REST
from lib.structures.room import Room

# POST arguments
post_parser = reqparse.RequestParser()
post_parser.add_argument('name', type=str, help='Room name is missing', required=True)

# PUT arguments
put_parser = reqparse.RequestParser()
put_parser.add_argument('id', type=str, help='Room id is missing', required=True)
put_parser.add_argument('name', type=str, help='Room name is missing', required=True)

# DELETE arguments
delete_parser = reqparse.RequestParser()
delete_parser.add_argument('id', type=str, help='Room id is missing', required=True)


class RESTRoom(REST):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def get(self):
		formatted_data = []

		rooms = self._home.get_all_rooms()

		for room in rooms:

			formatted_room = room.get_information()
			devices = room.get_all_devices()
			formatted_devices = []

			for device in devices:
				formatted_device = device.get_information()
				formatted_device['state'] = device.get_state()
				formatted_devices.append(formatted_device)

			formatted_room['devices'] = formatted_devices

			formatted_data.append(formatted_room)

		return formatted_data, 200

	def post(self):
		arguments = post_parser.parse_args(strict=True)

		room_id = self._database.insert_room(arguments['name'])
		response = {'id': room_id}

		self._home.build_rooms()
		return response, 200

	def put(self):
		arguments = put_parser.parse_args(strict=True)

		self._database.update_room(Room.crop_information(arguments))

		self._home.build_rooms()
		return '', 204

	def delete(self):
		arguments = delete_parser.parse_args(strict=True)

		self._database.delete_room(arguments['id'])

		self._home.build_rooms()
		return '', 204
