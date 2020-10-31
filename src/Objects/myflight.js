const UtilFunctions = require('../util');

const MyFlight = {
    flight(id, userid, date, flightnumber, ttl)  {
        return {
                id : id,
                userid : userid,
                flight_date : date,
                normalizedFlightnumber : UtilFunctions.normalizeFlightnumber(flightnumber),
                ttl: ttl
            }
    },

    'FLIGHT_SCHEMA' : {
            TableName : "MyFlights",
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH" }
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "N" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
    }
}

module.exports = MyFlight;