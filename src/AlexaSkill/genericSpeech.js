var moment = require('moment');

const Speech = {
    generateFlightSpeech(flight) {
        var delay = this.getDelay(flight);
        var remainingTime = this.getRemainingTime(flight);
        var speechText = this.getFlightnumber(flight.flightnumber);

        if (flight.iok == 'A') {
            speechText += " landet";
        } else {
            speechText += " startet";
        }
        
        if (flight.flightstatus == "DEP" || flight.flightstatus == "ONB") {
            speechText += "e";
        }

        if (this.flightPosition(flight.sbt) == 1) {
            speechText += " morgen";
        } else if (this.flightPosition(flight.sbt) == 0) {
            speechText += " heute";
            if (delay > 0) {
                speechText += " mit einer Verspätung von";
                if (delay == 1) {
                    speechText += " einer Minute";
                } else {
                    speechText += " " + delay + " Minuten";
                }
            } else if (delay < 0) {
                speechText += " " + Math.abs(delay) + " Minuten früher,";
            }
        } else if (this.flightPosition(flight.sbt) == -1) {
            speechText += " gestern";
        } else {
            speechText += " am " + moment(flight.sbt).format("DD.MM.YYYY");
        }

        speechText += " um " + moment(flight.sbt).add(delay,'minutes').format('HH:mm') + " Uhr.";

        if (flight.ebt != null && remainingTime < 0 && (flight.status != "DEP" && flight.status != "ONB")) {
            speechText += " Aktuell liegt eine unbekannte Verspätung von " + Math.abs(remainingTime) + " Minuten vor.";
        }

        if (flight.terminal != null && flight.iok == 'A') {
            speechText += " Das Abhol-<lang xml:lang='en-US'>Terminal</lang> ist " + flight.terminal + ".";
        }
        
        return speechText;
    },

    generateLocationSpeech(flights, location) {
        if (flights.length > 1) {
            var speechText = "Die nächsten Flüge für "+location.toUpperCase()+" sind:\n";
        } else {
            var speechText = "Der nächste Flug für "+location.toUpperCase()+" ist:\n";
        }
        flights.forEach((flight) => {
            speechText += this.generateSpeechShort(flight);
        });
        return speechText;
    },

    generateAircraftSpeech(flights, aircraft) {
        if (flights.length > 1) {
            var speechText = "Die nächsten Flüge vom Typ "+ aircraft.toUpperCase() +" sind:\n";
        } else {
            var speechText = "Der nächste Flug vom Typ "+ aircraft.toUpperCase() +" ist:\n";
        }
        flights.forEach((flight) => {
            speechText += this.generateSpeechShort(flight);
        });
        return speechText;
    },

    generateSpeechShort(flight) {
        if (flight != null) {

            speechText = this.getFlightnumber(flight.flightnumber);

            if (flight.iok == 'A') {
                speechText += " landet";
            } else {
                speechText += " startet";
            }

            if (this.flightPosition(flight.sbt) == 1) {
                speechText += " morgen";
            } else if (this.flightPosition(flight.sbt) == 0) {
                speechText += " heute";
            } else if (this.flightPosition(flight.sbt) == -1) {
                speechText += " gestern";
            } else {
                speechText += " am " + moment(flight.sbt).format("DD.MM.YYYY");
            }

            speechText += " um " + moment(flight.sbt).add(this.getDelay(flight),'minutes').format('HH:mm') + " Uhr.";
            speechText += "\n";

            return speechText;
        }
    },

    getFlightnumber(flightnumber) {
        return '<say-as interpret-as="spell-out">'+flightnumber.replace(/(\s+)/,"")+'</say-as>'
    },

    getRemainingTime(flight) {
        if(flight.ebt != null) {
            var remainingTime = moment().diff(moment(flight.ebt),'minutes');
        } else {
            var remainingTime = 0;
        }
        return remainingTime;
    },

    getDelay(flight) {
        if(flight.ebt != null) {
            var delay = moment(flight.ebt).diff(moment(flight.sbt),'minutes');
        } else {
            var delay =  0;
        }
        return delay;
    },

    flightPosition(sbt) {
        if (moment(sbt).isSame(moment(),'day')) {
            return 0;
        } else if (moment(sbt).isAfter(moment(),'day')) {
            return 1;
        } else {
            return -1;
        }
    }
}

module.exports = Speech;