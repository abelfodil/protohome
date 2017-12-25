import logging
from functools import wraps

from lib.structures.device import Device
from lib.structures.room import Room


class Home:
	def __init__(self, name, database):
		self.__name = name
		self.__database = database
		self.__rooms = []

		self.build_rooms()
		self.update_rooms()

	def add_room(self, room):
		self.__rooms.append(room)

		details = 'Added room "' + room.get_information()['id'] + '" in home.'
		logger = logging.getLogger(__name__)
		logger.info(details)

	def remove_room(self, room_name):
		if room_name in self.__rooms:
			self.__rooms.remove(room_name)

			details = 'Removed room "' + room_name + '" from home.'
		else:
			details = 'Failed to remove room "' + room_name + '" from home.'

		logger = logging.getLogger(__name__)
		logger.info(details)

	def get_room(self, room_name):
		for room in self.__rooms:
			if room == room_name:
				return room

		details = 'Room "' + room_name + '" not found.'
		logger = logging.getLogger(__name__)
		logger.info(details)

		return None

	def get_all_rooms(self):
		return self.__rooms

	def get_device_from_room(self, device_name, room_name):
		device = None

		room = self.get_room(room_name)
		if room is not None:
			device = room.get_device(device_name)

		return device

	def update_rooms(self):
		for room in self.__rooms:
			room.update_devices()

		details = 'All devices were updated.'
		logger = logging.getLogger(__name__)
		logger.info(details)

	def build_rooms(self):
		self.__rooms = []
		rooms_collection = self.__database.fetch_rooms()

		for room in rooms_collection:
			devices = []

			devices_collection = self.__database.fetch_devices(room['id'])
			for device in devices_collection:
				devices.append(Device(device))

			self.__rooms.append(Room(room, devices))
