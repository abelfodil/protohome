import http.client
import logging
from copy import deepcopy


class Device:
	__TIMEOUT = 1
	__PORT = 80
	__KEYS = ('id', 'name', 'category', 'address')

	def __init__(self, information):
		self.__information = self.crop_information(information)
		self.__state = ''

	def __eq__(self, device_id):
		return self.__information['id'] == device_id

	@staticmethod
	def crop_information(information):
		new_information = {}

		for key in information.keys():
			if key in Device.__KEYS:
				new_information[key] = information[key]

		return new_information

	def send_command(self, command):
		self.__state = ''

		request = "/" + self.__information['name'] + "/" + str(command)

		try:
			connection = http.client.HTTPConnection(self.__information['address'], self.__PORT, timeout=self.__TIMEOUT)
			connection.request("GET", request)
			raw_feedback = connection.getresponse()

		except (OSError, ConnectionRefusedError, http.client.RemoteDisconnected) as error:
			details = ''

			if isinstance(error, ConnectionRefusedError):
				details = 'Connection refused to device "' + self.__information['name'] + '".'
			elif isinstance(error, http.client.RemoteDisconnected):
				details = 'No feedback from device "' + self.__information['name'] + '".'
			elif isinstance(error, OSError):
				details = 'Failed to communicate with device "' + self.__information['name'] + '".'

			logger = logging.getLogger(__name__)
			logger.error(details)

		else:
			self.__state = raw_feedback.read().decode('UTF-8').strip()  # message can't be read afterwards

		return self.__state

	def turn_on(self):
		return self.send_command('turn_on')

	def turn_off(self):
		return self.send_command('turn_off')

	def toggle(self):
		if self.__state == 'off':
			self.turn_on()
		else:
			self.turn_off()

		return self.__state

	def get_state(self, get_latest_state=True):
		if get_latest_state:
			self.send_command('get_status')

		return self.__state

	def get_information(self):
		return deepcopy(self.__information)
