const https = require('https');
const DB = require('../Objects/table');
const Flight = require("../Objects/flight");
const moment = require('moment');
require('dotenv').config();

let options = (uri) => {
    return {
        host: process.env.HOST,
        port: process.env.PORT,
        path: '/v2/' + uri,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : process.env.APIKEY
        },
        method: 'GET'
    }
};

exports.handler = () => {
    (DB.tableExists(Flight.FLIGHT_SCHEMA.TableName)).catch((err) => {
        DB.createTable(Flight.FLIGHT_SCHEMA).then(() => {
            loadDepData()
            loadArrData()
        });
    }).then(() => {
        loadDepData()
        loadArrData()
    })
}

requestAPI = (options) => {
    return new Promise((resolve) => {
        let req = https.request(options, function(response) {
            let json = '';

            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                json += chunk;
            });
    
            response.on('end',() => { 
                obj = JSON.parse(json)
                resolve(obj)
            });
        });
    
        req.on('error', function(e) {
            console.log('Problem with request: ' + e.message);
        });
        
        req.end();
    })
}

loadDepData = () => {
    requestAPI(options('/flights/departures')).then (json => {
        let flights = []
        json.forEach(function(flight) {
            flights.push({
                PutRequest: {
                    Item : Flight.flight(
                        // flightnumber
                        flight['flightnumber'],
                        // sbt
                        moment(flight['plannedDepartureTime'].substr(0,16)).toISOString(true),
                        // iok
                        'D',
                        // ebt
                        flight['expectedDepartureTime'],
                        // flightstatus
                        flight['flightStatusDeparture'],
                        // terminal
                        flight['departureTerminal'],
                        // city
                        (flight['destinationAirportName'].split("/"))[0],
                        // airlinename
                        flight['airlineName']
                    )
                }
            })
        })
        saveToDB(flights)
    }).catch((err) => {
        console.error("Fehler beim Laden und Speichern der DEP Flügen: " + err);
    });
}

loadArrData = () => {
    requestAPI(options('/flights/arrivals')).then (json => {
        let flights = []
        json.forEach(function(flight) {
            flights.push({
                PutRequest: {
                    Item : Flight.flight(
                        // flightnumber
                        flight['flightnumber'],
                        // sbt
                        moment(flight['plannedArrivalTime'].substr(0,16)).toISOString(true),
                        // iok
                        'D',
                        // ebt
                        (flight['expectedArrivalTime']) ? moment(flight['expectedArrivalTime'].substr(0,16)).toISOString(true) : null,
                        // flightstatus
                        flight['flightStatusArrival'],
                        // terminal
                        flight['arrivalTerminal'],
                        // city
                        (flight['originAirportName'].split("/"))[0],
                        // airlinename
                        flight['airlineName']
                    )
                }
            })
        })
        saveToDB(flights)
    }).catch((err) => {
        console.error("Fehler beim Laden und Speichern der ARR Flügen: " + err);
    });
}

saveToDB = (flights) => {
    let flightsTemp = []
    flights.forEach((flight, index) => {
        flightsTemp.push(flight)
        if (flightsTemp.length >= 25) {
            let params = {
                RequestItems: {
                    'Flights' : flightsTemp
                }
            }
        
            flightsTemp = [];
            DB.putItems(params);
        }
    })
}