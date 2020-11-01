const Alexa = require('ask-sdk-core');
const Flights = require('./flightsHandler');
const WaitingTime = require('./waitingtimesHandler');
const Facts = require('../Objects/facts');
const Speech = require('./genericSpeech');

  const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Moin Moin zum Hamburger Flughafen Skill. Sage "Hilfe" wenn du nicht weiter weißt oder frage nach einem Flug.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Flughafen Hamburg', speechText)
        .getResponse();
    }
  };

  const FlightIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'FlightIntent';
    },
    async handle(handlerInput) {
      /**
       * REQUIRED: Operator
       */
      let operator;
      const operatorItem = handlerInput.requestEnvelope.request.intent.slots.Operator;
      if (operatorItem && operatorItem.value) {
          operator = operatorItem.value.toLowerCase();
      }

      /**
       * REQUIRED: Number
       */
      const numberItem = handlerInput.requestEnvelope.request.intent.slots.Flightnumber;
      let number;
      if (numberItem && numberItem.value) {
          number = numberItem.value.toLowerCase();
      }

      var flightnumber = operator + " " + number;

      var flight = await Flights.searchForFlightnumber(flightnumber);

      if (flight != null) {
        var speechText = Speech.generateFlightSpeech(flight);
      } else {
        var speechText = 'Leider konnte ich heute und morgen keinen Flug mit der Flugnummer ' + flightnumber.toUpperCase() + ' finden.';
      }

      return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Flughafen Hamburg', speechText.replace(/<(.|\n)*?>/g, ''))
      .getResponse();
    }
  };

  const SearchIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SearchIntent';
    },
    async handle(handlerInput) {
      /**
       * REQUIRED: Location
       */
      const locationItem = handlerInput.requestEnvelope.request.intent.slots.Location;
      let location;
      if (locationItem && locationItem.value) {
          location = locationItem.value.toLowerCase();
      }

      /**
       * Time
       */
      const timeItem = handlerInput.requestEnvelope.request.intent.slots.Time;
      let time;
      if (timeItem && timeItem.value) {
          time = timeItem.value.toLowerCase();
      }

      /**
       * REQUIRED: Date
       */
      const dateItem = handlerInput.requestEnvelope.request.intent.slots.Date;
      let date;
      if (dateItem && dateItem.value) {
          date = dateItem.value.toLowerCase();
      }

      /**
       * IOK
       */
      const iokItem = handlerInput.requestEnvelope.request.intent.slots.IOK;
      let iok;
      if (iokItem && iokItem.value) {
          iok = iokItem.resolutions.resolutionsPerAuthority[0].values[0].value.id;
      }

      var flights = await Flights.searchForFlights(location, time, date, iok);

      if (flights != null && flights.length > 0) {
        var speechText = Speech.generateLocationSpeech(flights.slice(0,3), location);
      } else {
        var speechText = 'Leider konnte ich keine passenden Flüge für heute und morgen finden.';
      }

      return handlerInput.responseBuilder
      .speak(speechText + '<break time="1s"/>  Möchtest du noch weitere Flüge suchen?')
      .withShouldEndSession(false)
      .reprompt("Bitte wiederhole deine Flug Anfrage.")
      .withSimpleCard('Flughafen Hamburg', speechText.replace(/<(.|\n)*?>/g, ''))
      .getResponse();
    }
  };

  const WaitingTimeIntent = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'WaitingTimeIntent';
    },
    async handle(handlerInput) {
      let speechText = 'Aktuell kann ich keine Wartezeit für die Sicherheitskontrolle finden.'

      let minutes = await WaitingTime.getMinutes();
      if (minutes != null) {
        let minuteSuffix = (minutes != 1) ? 'n' : '';
        speechText = `Die aktuelle Wartezeit an der Sicherheitskontrolle beträgt ${minutes} Minute${minuteSuffix}.`;
      }

      return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Flughafen Hamburg', speechText)
          .getResponse();
    }
  };

  const InfoIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'InfoIntent';
    },
    async handle(handlerInput) {
      /**
       * Required: Query
       */
      const queryItem = handlerInput.requestEnvelope.request.intent.slots.Query;
      let query;
      if (queryItem && queryItem.value) {
        query = queryItem.value.toLowerCase();
      }

      var fact = await Facts.getFact(query);

      if (fact != null) {
        var speechText = fact;
      } else {
        var speechText = "Leider habe ich nicht verstanden, was du wissen möchtest.";
      }

      return handlerInput.responseBuilder
      .speak(speechText + '<break time="1s"/>  Möchtest du noch etwas über den Flughafen wissen?')
      .withShouldEndSession(false)
      .reprompt("Bitte wiederhole deine Frage.")
      .withSimpleCard('Flughafen Hamburg', speechText)
      .getResponse();
    }
  };

  const AddFlightIntentHelper = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AddFlightIntent';
    },
    async handle(handlerInput) {
      /**
       * REQUIRED: Operator
       */
      let operator;
      const operatorItem = handlerInput.requestEnvelope.request.intent.slots.Operator;
      if (operatorItem && operatorItem.value) {
          operator = operatorItem.value.toLowerCase();
      }

      /**
       * REQUIRED: Number
       */
      const numberItem = handlerInput.requestEnvelope.request.intent.slots.Flightnumber;
      let number;
      if (numberItem && numberItem.value) {
          number = numberItem.value.toLowerCase();
      }

      /**
       * REQUIRED: Date
       */
      const dateItem = handlerInput.requestEnvelope.request.intent.slots.Date;
      let date;
      if (dateItem && dateItem.value) {
          date = dateItem.value.toLowerCase();
      }

      var flightnumber = operator + " " + number;

      if (operator.length > 0 && operator.length <= 4 && Number.isInteger(Number.parseInt(number))) {

        // user id
        var userid = handlerInput.requestEnvelope.context.System.user.userId;

        var result = await Flights.saveFlight(userid, flightnumber, date);

        if (Object.keys(result).length == 0) {
          var speechText = "Flug " + flightnumber.toUpperCase() + " erfolgreich hinzugefügt.";
        } else {
          var speechText = "Leider konnte ich den Flug " + flightnumber.toUpperCase() + " nicht hinzufügen";
        }
      } else {
        var speechText = "Leider war die verstandene Flugnummer nicht korrekt. Bitte probiere es erneut."
      }

      return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Flughafen Hamburg', speechText)
      .getResponse();
    }
  };

  const DeleteFlightIntentHelper = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'DeleteFlightIntent';
    },
    async handle(handlerInput) {
      /**
       * REQUIRED: Operator
       */
      let operator;
      const operatorItem = handlerInput.requestEnvelope.request.intent.slots.Operator;
      if (operatorItem && operatorItem.value) {
          operator = operatorItem.value.toLowerCase();
      }

      /**
       * REQUIRED: Number
       */
      const numberItem = handlerInput.requestEnvelope.request.intent.slots.Flightnumber;
      let number;
      if (numberItem && numberItem.value) {
          number = numberItem.value.toLowerCase();
      }

        /**
       * REQUIRED: Date
       */
      const dateItem = handlerInput.requestEnvelope.request.intent.slots.Date;
      let date;
      if (dateItem && dateItem.value) {
          date = dateItem.value.toLowerCase();
      }

      var flightnumber = operator + " " + number;

      // user id
      var userid = handlerInput.requestEnvelope.context.System.user.userId;

      var result = await Flights.deleteFlight(userid, flightnumber, date);

      if (!result.hasOwnProperty("Key")) {
        var speechText = "Flug " + flightnumber.toUpperCase() + " erfolgreich entfernt."
      } else {
        var speechText = "Leider konnte ich den Flug " + flightnumber.toUpperCase() + " heute und morgen nicht entfernen.";
      }

      return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Flughafen Hamburg', speechText)
      .getResponse();
    }
  };

  const MyFlightIntentHelper = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'MyFlightIntent';
    },
    async handle(handlerInput) {
      /**
       * Optional: Date
       */
      const dateItem = handlerInput.requestEnvelope.request.intent.slots.Date;
      let date;
      if (dateItem && dateItem.value) {
        date = dateItem.value.toLowerCase();
      }

      // user id
      var userid = handlerInput.requestEnvelope.context.System.user.userId;

      var flight = await Flights.myFlight(userid, date);

      if (flight != null) {
        var speechText = Speech.generateFlightSpeech(flight);
      } else {
        var speechText = 'Leider konnte ich für heute und morgen keinen passenden Flug von Dir finden.';
      }
      
      return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Flughafen Hamburg', speechText)
      .getResponse();
    }
  };

  const HelpIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const speechText = 'Frage nach Flügen mit einer Flugnummer, Datum oder Stadtname. z.B. wann landet der Flug LH 008 oder welche Flüge kommen aus Mallorca.';

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Flughafen Hamburg', speechText)
        .getResponse();
    }
  };

  const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speechText = 'Guten Flug! <audio src="https://flight-sound.s3.eu-central-1.amazonaws.com/flight_away.mp3" />';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Flughafen Hamburg', "Guten Flug!")
        .withShouldEndSession(true)
        .getResponse();
    }
  };

  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      //any cleanup logic goes here
      return handlerInput.responseBuilder
          .getResponse();
    }
  };

  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);

      var speechText = "Leider ging etwas schief. Bitte wiederhole den Befehl.";
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    },
  };

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    FlightIntentHandler,
    InfoIntentHandler,
    WaitingTimeIntent,
    AddFlightIntentHelper,
    DeleteFlightIntentHelper,
    MyFlightIntentHelper,
    SearchIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();