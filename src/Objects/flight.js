const UtilFunctions = require('../util');
const moment = require('moment');

const Flight = {
    flight(flightnumber, sbt, iok, ebt, flightstatus, terminal, city, airlineName)  {
        return {
            id : flightnumber.replace(/\s+/,"") + "-" + moment(sbt.substr(0,16)).format("YYYY-MM-DD"),
            sbt : moment(sbt.substr(0,16)).toISOString(true),
            iok : iok,
            ebt : (ebt) ? moment(ebt.substr(0,16)).toISOString(true) : null,
            flightstatus : flightstatus,
            terminal : terminal,
            city : (city != null) ? (city.split("/")[0]).toLowerCase() : null,
            airlineName : (airlineName != null) ? airlineName.toLowerCase() : null,
            flightnumber : flightnumber,
            normalizedFlightnumber : UtilFunctions.normalizeFlightnumber(flightnumber),
            ttl: moment(sbt.substr(0,16)).add(2,'days').startOf('day').unix()
        }
    },

    'FLIGHT_SCHEMA' : {
        TableName : "Flights",
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "sbt", KeyType: "RANGE" }
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "sbt", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    }
}

module.exports = Flight;