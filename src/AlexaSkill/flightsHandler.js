const DB = require('../Objects/table');
var Flight = require("../Objects/flight");
var MyFlight = require("../Objects/myflight");
const UtilFunctions = require('../util');
const moment = require('moment');

const Functions = {
    searchForFlightnumber(flightnumber) {
        return new Promise((resolve,reject) => {

            if (flightnumber == null) {
                return reject(null);
            }
    
            var params = {
                TableName: Flight.FLIGHT_SCHEMA.TableName,
                ExpressionAttributeValues: {
                        ":now": moment().subtract(30,'minutes').toISOString(true),
                        ":flightnumber": UtilFunctions.normalizeFlightnumber(flightnumber) 
                },
                FilterExpression: "sbt > :now and normalizedFlightnumber = :flightnumber"
            };
    
            DB.getItems(params).then((data) => {
                resolve(data.sort(function(a, b) {
                    return new Date(a.sbt) - new Date(b.sbt);
                })[0]);
            }).catch(err => {
                reject(err);
            });
        });
    },

    searchForFlights(location, time, date, iok) {
        return new Promise((resolve, reject) => {
            var expressionValues = [];
            var filterExpression = [];

            /**
             * DATE & TIME
             */
            if (date != null) {
                var now = moment(date,"YYYY-MM-DD").startOf('day');
            } else {
                var now = moment();
            }

            if (time != null) {
                now = moment(now).format("YYYY-MM-DD") + " " + time;
            } else {
                now = moment(now).format("YYYY-MM-DD") + " " + moment().format("HH:mm");
            }

            expressionValues[":now"] = moment(now).toISOString(true);
            filterExpression.push("sbt > :now");

            /**
             * IOK
             */

            if (iok != null) {
                expressionValues[":iok"] = iok;
                filterExpression.push("iok = :iok");
            }

            /**
             * CITY
             */

            if (location != null) {
                expressionValues[":city"] = location;
                filterExpression.push("contains(city,:city)");
            }
            
            expressionValues = Object.assign({}, expressionValues);
            filterExpression = filterExpression.join(" and ");

            var params = {
                TableName: Flight.FLIGHT_SCHEMA.TableName,
                ExpressionAttributeValues: expressionValues,
                FilterExpression: filterExpression
            };
    
            DB.getItems(params).then((data) => {
                resolve(data.sort(function(a, b) {
                    return new Date(a.sbt) - new Date(b.sbt);
                }).slice(0,3));
            }).catch(err => {
                reject(err);
            });
        });
    },

    searchForAircraft(date, aircraft) {
        return new Promise((resolve, reject) => {
            /**
             * DATE
             */

            if (date != null) {
                var date = moment(date).format("YYYY-MM-DD") + " " + moment().format("HH:mm");;
            } else {
                var date = moment();
            }

            var params = {
                TableName: Flight.FLIGHT_SCHEMA.TableName,
                ExpressionAttributeValues: {
                    ":date" : moment(date).toISOString(true),
                    ":aircraft" : aircraft,
                },
                FilterExpression: "sbt > :date and contains(aircraft,:aircraft)"
            };

            DB.getItems(params).then((data) => {
                resolve(data.sort(function(a, b) {
                    return new Date(a.sbt) - new Date(b.sbt);
                }).slice(0,3));
            }).catch(err => {
                reject(err);
            });
        });
    },

    async saveFlight(userid, flightnumber, date) {
        return new Promise((resolve, reject) => {
            var result = DB.tableExists(MyFlight.FLIGHT_SCHEMA.TableName);
            result.catch(err => {
                DB.createTable(MyFlight.FLIGHT_SCHEMA);
            }).then(data => {
                var id = userid + "-" + UtilFunctions.normalizeFlightnumber(flightnumber) + "-" + moment(date).format("YYYY-MM-DD");

                var ttl = moment(date).add(1,'years').startOf('day').unix();
                var params = {
                    TableName: MyFlight.FLIGHT_SCHEMA.TableName,
                    Item: MyFlight.flight(id.hashCode(), userid, moment(date).toISOString(true), flightnumber, ttl)
                };

                resolve(DB.putItem(params));
            });
        });
    },

    deleteFlight(userid, flightnumber, date) {
        return new Promise((resolve, reject) => {
            var id = userid + "-" + UtilFunctions.normalizeFlightnumber(flightnumber) + "-" + moment(date).format("YYYY-MM-DD");

            var params = {
                TableName: MyFlight.FLIGHT_SCHEMA.TableName,
                Key: {
                    id : id.hashCode()
                }
            };

            resolve(DB.removeItem(params));
        });
    },

    myFlight(userid, sbt) {
        return new Promise((resolve, reject) => {

        /**
         * DATE
         */

        if (sbt != null) {
            var date = moment(date).format("YYYY-MM-DD") + " " + moment().format("HH:mm");;
        } else {
            var date = moment();
        }

        var params = {
            TableName: MyFlight.FLIGHT_SCHEMA.TableName,
            ExpressionAttributeValues: {
                ":userid" : userid,
                ":flight_date" : moment(date).toISOString(true)
            },
            FilterExpression: "flight_date > :flight_date and userid = :userid"
        };

            DB.getItems(params).then((data) => {
                if(data.length > 0) {
                    
                    var user_flight = data.sort(function(a, b) {
                        return new Date(a.sbt) - new Date(b.sbt);
                    })[0];

                    console.log(user_flight);

                    // now find flight...
                    var params = {
                        TableName: Flight.FLIGHT_SCHEMA.TableName,
                        ExpressionAttributeValues: {
                            ":flightnumber" : user_flight.normalizedFlightnumber,
                            ":sbt_begin" : user_flight.flight_date,
                            ":sbt_end" : moment(user_flight.flight_date).add(1,'days').toISOString(true)
                        },
                        FilterExpression: "sbt between :sbt_begin and :sbt_end and normalizedFlightnumber = :flightnumber"
                    };

                    // slice: only one item
                    DB.getItems(params).then((data) => {
                            resolve(data.sort(function(a, b) {
                                return new Date(a.sbt) - new Date(b.sbt);
                            })[0]);
                    });
                } else {
                    resolve(null);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = Functions;

String.prototype.hashCode = function() {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };