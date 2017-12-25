import logging
from copy import deepcopy


class Room:
	__KEYS = ('id', 'name')

	def __init__(self, information):
		self.__information = {}
		self.__devices = []

		self.set_information(information)

	def __eq__(self, room_id):
		return self.__information['id'] == room_id

	@staticmethod
	def crop_information(information):
		new_information = {}

		for key in information.keys():
			if key in Room.__KEYS:
				new_information[key] = information[key]

		return new_information

	def get_information(self):
		return deepcopy(self.__information)

	def set_information(self, information):
		self.__information = self.crop_information(information)

	def append_device(self, device):
		self.__devices.append(device)

		details = 'Added device "' + device.get_information()['name'] + '" in room "' + \
				  self.__information['id'] + '".'

		logger = logging.getLogger(__name__)
		logger.info(details)

	def remove_device(self, device_id):
		if device_id in self.__devices:
			self.__devices.remove(device_id)
			details = 'Removed device "' + device_id + '" from room "' + self.__information['id'] + '".'
		else:
			details = 'Failed to remove device "' + device_id + '" from room "' + self.__information[
				'id'] + '".'

		logger = logging.getLogger(__name__)
		logger.info(details)

	def get_device(self, device_id):
		for device in self.__devices:
			if device == device_id:
				return device

		return None

	def get_all_devices(self):
		return self.__devices

	def update_devices(self):
		for device in self.__devices:
			device.update()
