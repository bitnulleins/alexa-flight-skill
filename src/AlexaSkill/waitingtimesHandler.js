const https = require('https');
const moment = require('moment');

let format = 'hh:mm:ss'

const Functions = {
    getMinutes() {
        return new Promise((resolve,reject) => {
            let options =  {
                host: 'hamburg-airport.de',
                path: '/service/waittimes/waittimes',
                json: true,
                method: 'GET'
            }

            let req = https.request(options, function(response) {
                let json = '';

                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    json += chunk;
                });

                response.on('end',() => {
                    obj = JSON.parse(json)

                    let minutes = null; // default value

                    // SiKo Öffnungszeiten
                    let beforeTime = moment('04:00:00', format);
                    let afterTime = moment('22:00:00', format);

                    if (moment().isBetween(beforeTime, afterTime)) {
                        minutes = Math.ceil(obj['waitingTimeSikoPlazaBKKMax'] / 60);
                    }
                    resolve(minutes)
                });
            });

            req.on('error', function(e) {
                console.log('Problem with WaitingTime request: ' + e.message);
            });

            req.end();
        })
    }
}

module.exports = Functions;