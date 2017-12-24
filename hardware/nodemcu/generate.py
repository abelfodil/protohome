import json
from pprint import pprint

data = json.load(open('devices.json'))
data = data['devices']

file_content = "#pragma once\n#include \"device.h\"\n\nDevice deviceList[] = {"

for index, device in enumerate(data):
	file_content += "\n\t"

	file_content += "{\"" + device['name'] + "\", " + str(device['pin']) + ", false}"
	if index + 1 < len(data):
		file_content += ","


file_content += "\n};"

file = open('device_list.h', 'w')
file.write(file_content)
file.close()
