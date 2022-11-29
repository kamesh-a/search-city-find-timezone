const { getCountryInfo } = require("./country-helpers");
const { formatDate, getTzShortName } = require("./date-helpers");
const { searchByPhrase } = require("./timezone-helpers");

function buildObjInfoWithTz( tzName, keyWordMatch ) {
    if( tzName ) {
        const zone = tzName?.trim();
        const { id: countryCode, name: countryName } = getCountryInfo(zone);
        const formattedTime = formatDate(zone);
        const [day,time,tzFullName] = formattedTime.split('__');
        return {
            time,
            day,
            phrase: keyWordMatch,
            countryCode,
            countryName: countryName,
            tzRaw: zone,
            tzShort: getTzShortName(tzFullName),
            tzFull : tzFullName
        }
    }
}


function fillTimeZoneAndCountryInfo( searchResultObj ) {
    if( searchResultObj?.tzList ) {
        const { tzList, phrase: matchedKeyWord } = searchResultObj;
        const tzListUpdated = tzList
                                .filter( tzName => !!tzName?.trim())
                                .map(tzName => buildObjInfoWithTz(tzName, matchedKeyWord));
        return { ...searchResultObj, tzList : tzListUpdated };
    }
}

function getTimeWithCityCountryZoneName( text ) {
    if( text ) {
        const searchText = text?.trim();
        const {err : errored , result } = searchByPhrase(searchText);
        if( !errored ) {
            return result.map(fillTimeZoneAndCountryInfo)
        }
    }

    return [];
}

module.exports = {
    getTimeWithCityCountryZoneName
}