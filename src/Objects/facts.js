var promise = require('promise');

const Facts = {
    getFact(query) {
        return new Promise((resolve, reject) => {
            query = query.toLowerCase();
            if (query == "" || query.includes("zufall") || query.includes("zufällig")) {
                var text = this.getRandomFact() ;
            } else if (query.includes("geschichte") || query.includes("flughafen")) {
                var text = this.FACTS.HISTORY ;
            } else if (query.includes("mcdonalds")) {
                var text = this.FACTS.MCDONALDS ;
            } else if (query.includes("lan") || query.includes("wlan") || query.includes("internet")) {
                var text = this.FACTS.WLAN ;
            } else {
                var text = "Leider konnte ich keine passende Antwort finden." ;
            }
            resolve(text);
        });
    },

    getRandomFact() {
        var keys = Object.keys(this.FACTS);
        return this.FACTS[keys[ keys.length * Math.random() << 0]];
    },

    FACTS : {
        WLAN : 'Der Name des WLANs lautet: "HAM AIRPORT FREE WIFI"',
        HISTORY : 'Der Flughafen eröffnete 1911 seine Türen. Damit ist er der älteste Flughafen Deutschlands.',
        MCDONALDS : 'Es gibt ein McDonalds in <lang xml:lang="en-US">Terminal</lang> 1.'
    }
}

module.exports = Facts;