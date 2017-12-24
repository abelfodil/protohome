
#pragma once

const String METHOD_FORBIDDEN = "HTTP/1.1 403 Forbidden";
const String DEVICE_NOT_FOUND = "HTTP/1.1 404 Not Found";
const String METHOD_NOT_ALLOWED = "HTTP/1.1 405 Method Not Allowed";


String formatState(bool state) ;
String formatSuccessfulResponse(bool state);
void parseRequest(const String &request, String &argument1, String &argument2);
String matchUntilCharacter(const String &stringToMatch, char character);
int matchBetweenDelimiter(const String &stringToMatch, String &result, char delimiter, int startFromHere);
