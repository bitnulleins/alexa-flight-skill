var promise = require('promise');

const Facts = {
    getFact(query) {
        return new Promise((resolve, reject) => {
            query = query.toLowerCase();
            if (query == null || query == "" || query.includes("zufall") || query.includes("zufällig")) {
                var text = 'Hier eine zufällige Information: <break time=\"1s\"/>' + this.getRandomFact() ;
            } else if (query.includes("geschichte") || query.includes("flughafen")) {
                var text = this.FACTS.HISTORY ;
            } else if (query.includes("mcdonalds") || query.includes("mc donalds")) {
                var text = this.FACTS.MCDONALDS ;
            } else if (query.includes("lan") || query.includes("wlan") || query.includes("internet")) {
                var text = this.FACTS.WLAN;
            } else if (query.includes("corona") || query.includes("maskenpflicht") || query.includes("maske")) {
                var text = this.FACTS.CORONA;
            } else {
                var text = "Leider konnte ich keine passende Antwort finden. Bitte probiere es mit einer anderen Frage erneut." ;
            }
            resolve(text);
        });
    },

    getRandomFact() {
        var keys = Object.keys(this.FACTS);
        return this.FACTS[keys[ keys.length * Math.random() << 0]];
    },

    FACTS : {
        CORONA : 'Am Hamburger Flughafen gilt eine Maskenpflicht. Sie können sich auch auf Corona testen lassen.',
        WLAN : 'Der Name des kostenlosen WLANs lautet: "HAM AIRPORT FREE WIFI".',
        HISTORY : 'Der Flughafen eröffnete 1911 seine Türen. Damit ist er der älteste Flughafen Deutschlands.',
        MCDONALDS : 'Es gibt einen McDonalds in <lang xml:lang="en-US">Terminal</lang> 1.'
    }
}

module.exports = Facts;