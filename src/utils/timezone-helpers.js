const { countryTimeZoneMap, cityTimeZoneMap, tzAbbrevationMap, zoneAndPhrasesMap, tzList } = require('../../timezone-data/tz-info');
const { getCountriesForTimezone } = require('countries-and-timezones');
/** 
    Ref: https://share.anysnap.app/fGHDsCbpQ2BL

    [{
        name : India,
        isoFormatName: IN,
        timeZoneRaw: Asia/Kolkata
        timeZoneAbbr: Indian Standard Time,
        timeZoneShort : IST,
        formattedTime : <2022-11-25 01:29:35 pm [India Standard Time]> or custom format
        phrase : <chennai|tanjore>
    }]

*/ 

const tzKeys = [...tzAbbrevationMap.keys()];
const countryKeys = [...countryTimeZoneMap.keys()];
const cityKeys = [...cityTimeZoneMap.keys()];

const META_INFO = {
    isCity: false,
    isCountry: false,
    isTzAbbr: false,
    isTzName: false,
    isPhraseName: false,
};

const DEFAULT_SHAPE = {
    phrase: '',
    tzList: null,
    name: null,
    meta: META_INFO
}

function searchByTzKeys( phrase ) {
    const zone = phrase?.toUpperCase();
    if( tzKeys?.includes(zone)) {
        const tzList = tzAbbrevationMap.get(zone);
        return [{
            ...DEFAULT_SHAPE,
            phrase: zone,
            tzList,
            meta: {
                ...META_INFO,
                isTzAbbr: true
            }
        }]
    }
}

function searchByCountryKeys( phrase ) {
    const name = phrase?.toLowerCase();
    if(countryKeys.length) {
        const result = countryKeys
            .filter( cName => {
                return cName?.toLowerCase().includes(name);
            })
            .map( cName => {
                const tzList = countryTimeZoneMap.get(cName);
                return {
                    ...DEFAULT_SHAPE,
                    phrase: cName,
                    tzList,
                    meta: {
                        ...META_INFO,
                        isCountry: true
                    }
                }
            });

        return result;

    }
}

function searchByCityKeys( phrase) {
    const name = phrase?.toLowerCase();
    if(cityKeys.length) {
        const result = cityKeys
            .filter( cName => {
                return cName?.toLowerCase().includes(name);
            })
            .map( cName => {
                const tzList = cityTimeZoneMap.get(cName);
                return {
                    ...DEFAULT_SHAPE,
                    phrase: cName,
                    tzList,
                    meta: {
                        ...META_INFO,
                        isCity: true
                    }
                }
            });

        return result;
    }
}

function searchByZonePhraseKeys( phrase) {
    const name = phrase?.toLowerCase();
    const result = [];
    if(zoneAndPhrasesMap.size) {
        zoneAndPhrasesMap
        .forEach( (phraseWordList, tzNameKey) => {
            phraseWordList
                .filter( word => {
                    return word.toLowerCase().includes(name)
                })
                .forEach( word => {
                    result.push({
                        ...DEFAULT_SHAPE,
                        phrase: word,
                        tzList: [tzNameKey],
                        meta: {
                            ...META_INFO,
                            isPhraseName: true
                        }
                    })
                })
        })

        return result;
    }
}

function findZone(search, tzList = []) {
    let searchPhrase = search?.trim();
    if (searchPhrase.includes(' ')) {
        searchPhrase = searchPhrase.replaceAll(' ', '_');
    }
    return tzList.filter(e => e.toLowerCase().includes(searchPhrase ?.toLowerCase()));
}

// function getIndexOfZone(tz) {
//     return tzList?.indexOf(tz);
// }

// function findZoneMatchInMap(tz, tzMap = null) {
//     if( tzMap && tz ) {
//         const index = getIndexOfZone(tz);
//         const output = {
//             [tz] : []
//         };

//         tzMap.forEach((zoneList, key) => {
//             if(zoneList.includes(index)) {
//                 output[tz].push(key);
//             };
//         });

//         return output;
//     }
// }

// function getCountryForZone(tzName) {
//     return tzName && getCountriesForTimezone(tzName?.trim());
// }

function findCountryForZone(tzSearchPhrase) {
    // TODO: POSSIBILY OF HAVING MORE TZNAME discarding for now.
    const [tzName] = findZone(tzSearchPhrase, tzList);
    const result = [];
    countryTimeZoneMap
        .forEach( (tzList, key) => {
            if(tzList.includes(tzName)) {
                result.push({
                    ...DEFAULT_SHAPE,
                    phrase: tzSearchPhrase,
                    tzList: [tzName],
                    name: key,
                    meta: {
                        ...META_INFO,
                        isTzName: true
                    }
                })
            }
        })
    return result;
}

/**
 * Order of searching
 * PST PDT - done
 * CountryName - done
 * cityName - done
 * timeZoneName - done
 * zonePhrase
 */
function searchByPhrase(text) {
    
    const phrase = text?.trim();
    if( phrase ) {
        let result = [];
        const tzResult = searchByTzKeys(phrase);

        if( tzResult?.length ) {
            result = [ ...tzResult ];
        }

        const cityResult = searchByCityKeys(phrase);
        if( cityResult?.length ) {
            result = [ ...result, ...cityResult ];
        }

        const countryResult = searchByCountryKeys(phrase);
        if( countryResult?.length ) {
            result = [ ...result, ...countryResult ];
        }

        const zoneResult = findCountryForZone(phrase);
        if( zoneResult?.length ) {
            result = [ ...result, ...zoneResult ];
        }

        const phraseResult = searchByZonePhraseKeys(phrase);
        if( phraseResult?.length ) {
            result = [ ...result, ...phraseResult ];
        }
        
       
        if( result?.length ) {
            return result;
        }

        return [DEFAULT_SHAPE];
    }
    
}


console.time('searchByPhrase')
// var out = findCountryForZone('kolkat');
// var out= searchByCountryKeys('alb')
// var out= searchByCityKeys('tanjore')
// var out = searchByTzKeys('AZOST')


// var out = searchByPhrase('kolkat');
var out= searchByPhrase('mid')
// var out= searchByPhrase('tanjore')
// var out = searchByPhrase('AZOST')
// var out = searchByPhrase('U.S.a')
console.log(out)
console.timeEnd('searchByPhrase')


module.exports = {
    findZone,
}