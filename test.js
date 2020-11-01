const data = require('./src/DataLoader/loadData');
const flightHandler = require('./src/AlexaSkill/flightsHandler');
const waitingtimeHandler = require('./src/AlexaSkill/waitingtimesHandler');

waitingtimeHandler.getMinutes().then((minutes) => {
    console.log(minutes)
})
