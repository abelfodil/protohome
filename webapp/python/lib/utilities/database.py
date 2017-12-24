import logging
import os
import binascii
from pymongo import MongoClient
import pymongo.errors as MongoErrors


class Database:
	DATABASE_NAME = 'protohome'

	def __init__(self, name):
		self.__name = name
		self.__client = MongoClient()

		while self.server_unavailable():
			continue

		self.__database = self.__client[self.DATABASE_NAME]

		self.init_database()

	def __del__(self):
		self.__client.close()

	def init_database(self):
		self.__database['rooms'].create_index([('id', 1)], unique=True)
		self.__database['devices'].create_index([('name', 1), ('room', 1)], unique=True)

	def server_unavailable(self):
		try:
			self.__client.admin.command('ismaster')
		except MongoErrors.ConnectionFailure:
			details = 'Could not connect to MongoDB server.'
			logger = logging.getLogger(__name__)
			logger.critical(details)
			return True
		else:
			return False

	def fetch_rooms(self):
		if self.server_unavailable():
			return []

		rooms = self.__database['rooms'].find()
		return rooms

	def fetch_devices(self, room_id):
		if self.server_unavailable():
			return []

		devices = self.__database['devices'].find({"room": room_id})
		return devices

	def update_room(self, room_information):
		self.__database['rooms'].update({'id': room_information['id']}, room_information)

	def update_device(self, room_id, device_information):
		data = device_information
		data['room'] = room_id

		self.__database['devices'].update({
			'name': data['name'],
			'room': room_id
		}, data)

	def insert_room(self, room_name):
		room_id = binascii.hexlify(os.urandom(20)).decode()

		formatted_data = {
			'id': room_id,
			'name': room_name
		}

		self.__database['rooms'].insert_one(formatted_data)

		return room_id

	def insert_device(self, room_id, device_information):
		data = device_information
		data['room'] = room_id

		try:
			self.__database['devices'].insert_one(data)
		except MongoErrors.DuplicateKeyError as error:
			details = 'Device "' + data['name'] + '" already exists in database.'
			logger = logging.getLogger(__name__)
			logger.warning(details)
			raise error

	def delete_room(self, room_id):
		self.__database['rooms'].delete_one({'id': room_id})
		self.__database['devices'].delete_many({'room': room_id})

	def delete_device(self, room_id, device_name):
		self.__database['devices'].delete_one({'name': device_name, 'room': room_id})
