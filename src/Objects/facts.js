var promise = require('promise');

const Facts = {
    getFact(query) {
        return new Promise((resolve, reject) => {
            query = (query !== null) ? query.toLowerCase() : query;
            if (query.includes("etwas") || query == "" || query.includes("zufall") || query.includes("zufällig")) {
                var text = 'Hier eine zufällige Information: <break time=\"0.5s\"/>' + this.getRandomFact();
            } else if (query.includes('edeka') || query.includes('lebensmittel')) {
                var text = this.FACTS.EDEKA ;
            } else if (query.includes("geschichte") || query.includes("flughafen")) {
                var text = this.FACTS.HISTORY ;
            } else if (query.includes("mcdonalds") || query.includes("mc donalds")) {
                var text = this.FACTS.MCDONALDS ;
            } else if (query.includes("lan") || query.includes("wlan") || query.includes("internet")) {
                var text = this.FACTS.WLAN ;
            } else if (query.includes("corona") || query.includes("maskenpflicht") || query.includes("maske")) {
                var text = this.FACTS.CORONA ;
            } else if (query.includes("shoppen") || query.includes('feiertage') || query.includes('weihnachten') || query.includes('einkaufen') || query.includes('kaufen')) {
                var text = this.FACTS.LAEDEN ;
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
        LAEDEN : 'Es gibt über 30 Läden, die auch an Feiertagen geöffnet haben. Zum Beispiel Lebensmittel-, Klamotten- oder Zeitschritenläden.',
        EDEKA : 'Der Edeka im Flughafen hat 365 Tage im Jahr geöffnet.',
        OPEN : 'Der Hamburger Flughafen hat 365 Tage im Jahr von 04:00 Uhr bis 00:00 Uhr geöffnet.',
        CORONA : 'Am Hamburger Flughafen gilt eine Maskenpflicht. Es gibt auch zwei Corona Testzentren.',
        WLAN : 'Der Name des kostenlosen WLANs lautet: "HAM AIRPORT FREE WIFI".',
        HISTORY : 'Der Flughafen eröffnete 1911 seine Türen. Damit ist er der älteste Flughafen Deutschlands.',
        MCDONALDS : 'Es gibt einen McDonalds in <lang xml:lang="en-US">Terminal</lang> 1.'
    }
}

module.exports = Facts;