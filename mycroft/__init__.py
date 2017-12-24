from os.path import dirname, abspath, join

from adapt.intent import IntentBuilder
from mycroft.skills.core import MycroftSkill
from mycroft.util.log import getLogger

import requests
import json

__author__ = 'Anes Belfodil'

LOGGER = getLogger(__name__)


class ProtohomeSkill(MycroftSkill):
    def __init__(self):
        super(ProtohomeSkill, self).__init__(name="ProtohomeSkill")

    def initialize(self):
        update_deviceIntent = IntentBuilder("update_deviceIntent").require(
            "update_deviceKeyword").require("State").require("Device").require("Room").build()

        self.register_intent(update_deviceIntent,
                             self.handleupdate_deviceIntent)

    def handleupdate_deviceIntent(self, message):

        device = message.data.get('Device', None)
        state = message.data.get('State', None)
        room = message.data.get('Room', None)

        payload = {'device': device, 'action': state, 'froom': room}

        try:
            query = requests.post("http://proto.home:5000/rest", data=payload)
        except:
            self.speak_dialog('failure')
            return 1

        if query.status_code == requests.codes.ok:
            response = json.loads(query.text)

            if response['state'] != 'unavailable':
                feedback = {'device': device, 'state': state}
                self.speak_dialog('update', feedback)
            else:
                self.speak_dialog('unavailable', {'device': device})
        else:
            self.speak_dialog('error')

    def stop(self):
        pass


def create_skill():
    return ProtohomeSkill()
