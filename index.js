var upperCase = /^[A-Z]*$/;
function allUpperCase(str) {
    return upperCase.test(str);
}

function normaliseString(str) {
    // normalise case
    if (allUpperCase(str)) {
        return str.toLowerCase();
    }
    var newString = str[0].toLowerCase() + str.substring(1);
    newString = newString.replace('ID', 'Id');
    newString = newString.replace(/[A-Z]([A-Z]+)[A-Z][a-z]$/, (m, g) => m.replace(g, g.toLowerCase()));
    return newString;
}

function normaliseCase(obj, inArray = false, checkCyclic = true, shouldRecurse = true) {
    if (checkCyclic && shouldRecurse) {
        try {
            JSON.stringify(obj);
        } catch (ex) {
            return normaliseCase(obj, inArray, false, false);
        }
        return normaliseCase(obj, inArray, false);
    }
    if (!obj) return obj;

    if (!inArray && (typeof obj === 'string' && obj.length > 0)) {
        return normaliseString(obj);
    }

    if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(function (o) { return normaliseCase(o, true, checkCyclic, shouldRecurse); });
        }
        return Object.keys(obj).reduce(
            function (n, k) {
                var normalisedKey = normaliseCase(k, false, checkCyclic);
                var normalisedValue = shouldRecurse ? normaliseCase(obj[k], true, checkCyclic) : obj[k];
                n[normalisedKey] = normalisedValue;
                return n;
            },
            {}
        );
    }

    return obj;
}

module.exports = normaliseCase;
