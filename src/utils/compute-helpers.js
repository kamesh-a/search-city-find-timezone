import { getCountryInfo } from "./country-helpers"
import { formatDate, getTzShortName } from "./date-helpers";
import { getLastPartOfTimeZone, searchByPhrase } from "./timezone-helpers";

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

// ref: shape of searchResultObj = https://share.anysnap.app/fAChXg747hZq
function fillTimeZoneAndCountryInfo( searchResultObj ) {
    if( searchResultObj?.tzList ) {
        const { tzList, phrase: matchedKeyWord, meta } = searchResultObj;
        let tzListUpdated = tzList
                                .filter( tzName => !!tzName?.trim())
                                .map(tzName => buildObjInfoWithTz(tzName, matchedKeyWord));
        
        /** 
        * In case searched term is "IST" rather country, city.
        * 
        * current : "India - IST(IST) <time>"
        * expected : "India - Kolkata(IST) <time>"
        * 
        * Below block of code uses meta info to make patches
        * on data
        */
        if(meta?.isTzAbbr || meta?.isCountry) {
            tzListUpdated = tzListUpdated
                .map( info => {
                    return { ...info, phrase: getLastPartOfTimeZone(info.tzRaw)}
                })
        }
        
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

function getTzInfoByTimeZoneName( tzName ) {
    return buildObjInfoWithTz(tzName, getLastPartOfTimeZone(tzName))
}

function getSystemTzInfo() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return getTzInfoByTimeZoneName(timeZone)
}

export {
    getTimeWithCityCountryZoneName,
    getSystemTzInfo,
    getTzInfoByTimeZoneName
}