const data = require('./src/DataLoader/loadData');
const flightHandler = require('./src/AlexaSkill/flightsHandler');
const waitingtimeHandler = require('./src/AlexaSkill/waitingtimesHandler');
const facts = require('./src/Objects/facts.js');

waitingtimeHandler.getMinutes().then((minutes) => {
    console.log(minutes)
})

facts.getFact("ich lebensmittel kaufen").then((answer) => {
    console.log(answer)
})