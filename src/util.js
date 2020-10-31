const UtilFunctions = {
    normalizeFlightnumber(flightnumber) {
        if (flightnumber.includes(" ")) {
            var res = flightnumber.toLowerCase().split(/(\s+)/).filter( e => e.trim().length > 0);
        } else {
            var res = flightnumber.toLowerCase().replace(/(\s+)/,"").split(/(?<=\D)(?=\d)/);
        }
        return res[0] + res[1].replace(/^0+(?!$)/g, "");
    },

    hashCode(value) {
        let hash = 0, i, chr;
        for (i = 0; i < value.length; i++) {
            chr   = value.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}

module.exports = UtilFunctions;