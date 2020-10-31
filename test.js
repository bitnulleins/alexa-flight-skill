const data = require('./src/DataLoader/loadData');
const table = require('./src/AlexaSkill/flightsHandler');

data.handler()

table.searchForFlights('mallorca', null,null,null).then((resolve) => {
    console.log(resolve)
})