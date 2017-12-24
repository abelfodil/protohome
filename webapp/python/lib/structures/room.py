import logging
from copy import deepcopy


class Room:
	__KEYS = ('id', 'name')

	def __init__(self, information, devices=[]):
		self.__information = self.crop_information(information)
		self.__devices = devices

	def __eq__(self, name):
		return self.__information['id'] == name

	@staticmethod
	def crop_information(information):
		new_information = {}

		for key in information.keys():
			if key in Room.__KEYS:
				new_information[key] = information[key]

		return new_information

	def get_information(self):
		return deepcopy(self.__information)

	def add_device(self, device):
		self.__devices.append(device)

		details = 'Added device "' + device.get_information()['name'] + '" in room "' + \
				  self.__information['id'] + '".'

		logger = logging.getLogger(__name__)
		logger.info(details)

	def remove_device(self, device_name):
		if device_name in self.__devices:
			self.__devices.remove(device_name)
			details = 'Removed device "' + device_name + '" from room "' + self.__information['id'] + '".'
		else:
			details = 'Failed to remove device "' + device_name + '" from room "' + self.__information[
				'id'] + '".'

		logger = logging.getLogger(__name__)
		logger.info(details)

	def get_device(self, device_name):
		for device in self.__devices:
			if device == device_name:
				return device

		details = 'Device "' + device_name + '" not found.'
		logger = logging.getLogger(__name__)
		logger.info(details)

		return None

	def get_all_devices(self):
		return self.__devices

	def update_devices(self):
		for device in self.__devices:
			device.update()

		details = 'Devices in room "' + self.__information['id'] + '" updated.'
		logger = logging.getLogger(__name__)
		logger.info(details)
