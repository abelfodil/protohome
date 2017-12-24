
#include "request.h"

String formatState(bool state) {
  return state ? "on" : "off";
}

String formatSuccessfulResponse(bool state) {

  return "HTTP/1.1 200 OK\nContent-Type: text/plain\n\n" + formatState(state);

}

String matchUntilCharacter(const String &stringToMatch, char character) {

  size_t stringToMatchLength = stringToMatch.length();

  for (int i = 0; i < stringToMatchLength; i++) {
    if (stringToMatch[i] == character) {
      return stringToMatch.substring(0, i);
    }
  }

  return stringToMatch;
}

int matchBetweenDelimiter(const String &stringToMatch, String &result, char delimiter, int startFromHere) {
  int startingPosition = startFromHere;
  size_t stringToMatchLength = stringToMatch.length();

  while (stringToMatch[startingPosition] == delimiter && startingPosition < stringToMatchLength) {
    startingPosition++;
  }

  int endingPosition = startingPosition;

  while (stringToMatch[endingPosition] != delimiter && endingPosition < stringToMatchLength) {
    endingPosition++;
  }


  result = stringToMatch.substring(startingPosition, endingPosition);
  return endingPosition;

}

void parseRequest(String &request, String &argument1, String &argument2) {

  // Format the string
  request.replace("GET ", "");
  request.trim();

  request = matchUntilCharacter(request, ' ');

  int argument1End = matchBetweenDelimiter(request, argument1, '/', 0);
  argument1.toLowerCase();
  
  matchBetweenDelimiter(request, argument2, '/', argument1End);
  argument2.toLowerCase();
}

