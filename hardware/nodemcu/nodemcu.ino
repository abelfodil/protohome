#include <ESP8266WiFi.h>
#include "credentials.h"
#include "request.h"
#include "device_list.h"

WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  delay(10);


  size_t nbDevice = sizeof(deviceList) / sizeof(Device);

  for (int i = 0; i < nbDevice; i++) {
    pinMode(deviceList[i].pin, OUTPUT);
    digitalWrite(deviceList[i].pin, 0);
  }

  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("WiFi connected");

  // Start the server
  server.begin();
  Serial.println("Server started");

  // Print the IP address
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Wait until the client sends some data
  while (!client.available()) {
    delay(1);
  }

  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  // We only allow get
  if (!request.startsWith("GET")) {
    client.print(METHOD_FORBIDDEN);
    return;
  }

  String requestedDevice;
  String command;



  parseRequest(request, requestedDevice, command);

  Serial.println(requestedDevice);
  Serial.println(command);
  
  bool match = false;
  int index;

  size_t nbDevice = sizeof(deviceList) / sizeof(Device);

  for (int i = 0; i < nbDevice; i++) {
    if (deviceList[i].name == requestedDevice) {
      match = true;
      index = i;
      break;
    }
  }

  if (match) {
    String response;

    if (command == "turn_on") {
      digitalWrite(deviceList[index].pin, 1);
      deviceList[index].state = true;

      response = formatSuccessfulResponse(deviceList[index].state);

    } else if (command == "turn_off") {
      digitalWrite(deviceList[index].pin, 0);
      deviceList[index].state = false;

      response = formatSuccessfulResponse(deviceList[index].state);

    } else if (command == "get_status") {
      response = formatSuccessfulResponse(deviceList[index].state);

    } else
      response = METHOD_NOT_ALLOWED;

    client.print(response);

  } else {
    
    client.print(DEVICE_NOT_FOUND);
  }

  delay(1);
  Serial.println("Client disonnected");

}

