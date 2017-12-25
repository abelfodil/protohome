from lib.structures.device import Device
from lib.structures.room import Room


class Home:
	def __init__(self, name, database):
		self.__name = name
		self.__database = database
		self.__rooms = []

		self.reload_home()

	def append_room(self, room):
		self.__rooms.append(room)

	def update_room(self, room_information):
		room = self.get_room(room_information['id'])
		room.set_information(room_information)

	def remove_room(self, room_id):
		if room_id in self.__rooms:
			self.__rooms.remove(room_id)
			return True
		else:
			return False

	def get_room(self, room_name):
		for room in self.__rooms:
			if room == room_name:
				return room

		return None

	def get_all_rooms(self):
		return self.__rooms

	def get_device_from_room(self, device_id, room_id):
		device = None

		room = self.get_room(room_id)
		if room is not None:
			device = room.get_device(device_id)

		return device

	def append_device_to_room(self, device, room_id):
		room = self.get_room(room_id)

		if room is not None:
			room.append_device(device)

	def remove_device_from_room(self, device_id, room_id):
		room = self.get_room(room_id)

		if room is not None:
			room.remove_device(device_id)

	def fetch_devices_states(self):
		for room in self.__rooms:
			room.fetch_devices_states()

	def reload_home(self):
		self.__rooms = []
		rooms_collection = self.__database.fetch_rooms()

		for room_information in rooms_collection:
			new_room = Room(room_information)

			devices_collection = self.__database.fetch_devices(room_information['id'])
			for device in devices_collection:
				new_room.append_device(Device(device))

			self.__rooms.append(new_room)

		self.fetch_devices_states()
