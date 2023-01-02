import { 
        countryTimeZoneMap, 
        cityTimeZoneMap, 
        tzAbbrevationMap, 
        tzFullNameAbbrevMap,
        tzFullNameZoneMap,
        zoneAndPhrasesMap, 
        tzList 
    } from '../../timezone-data/tz-info';
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
const tzNameAbbrevKeys = [...tzFullNameAbbrevMap.keys()];
const tzNameKeys = [...tzFullNameZoneMap.keys()];

const META_INFO = {
    isCity: false,
    isCountry: false,
    isTzAbbr: false,
    isTzName: false,
    isPhraseName: false,
    isTzFullName: false
};

const DEFAULT_SHAPE = {
    phrase: null,
    tzList: null,
    name: null,
    meta: META_INFO
}

/**
 * 
 * file: timezone-data/tz-info.js
 * 
 * Understanding data from time zone data is important to understand code
 * if you are able to see the shape of one map you can uncover
 * all the data points. We have split the maps into country, city
 * abbrevation based all the exactly same pattern each other.
 * 
 * But apart from below 
 * "timezone name" splitting Asia/Kolkata - `kolkata` becomes searchable (findCountryForZone fn)
 * "zone phrase" names are most used names for a country or place 
 *      ex: `United States` may be referred as `USA, u.s.a, US` these variations 
 *           we are covering here.
 */

// Ref: tzAbbrevationMap in time zone data to understand the shape
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

// Ref: tzFullNameAbbrevMap in time zone data to understand the shape
function searchByTzNameAbbrevKeys(phrase) {
  const name = phrase?.toLowerCase();
  if (tzNameAbbrevKeys.length) {
    const result = tzNameAbbrevKeys
      .filter((tzName) => {
        return tzName?.toLowerCase().includes(name);
      })
      .map((tzName) => {
        const tzAbbrev = tzFullNameAbbrevMap.get(tzName);
        const tzList = tzAbbrevationMap.get(tzAbbrev);
        return {
          ...DEFAULT_SHAPE,
          phrase: tzName,
          tzList,
          meta: {
            ...META_INFO,
            isTzAbbr: true,
          },
        };
      });
    return result;
  }
}

function searchByTzNameKeys(phrase) {
    const name = phrase?.toLowerCase();
    if (tzNameKeys.length) {
      const result = tzNameKeys
        .filter((tzName) => {
          return tzName?.toLowerCase().includes(name);
        })
        .map((tzName) => {
          const tzList = tzFullNameZoneMap.get(tzName);
          return {
            ...DEFAULT_SHAPE,
            phrase: tzName,
            tzList,
            meta: {
              ...META_INFO,
              isTzFullName: true,
            },
          };
        });
      return result;
    }
  }

// Ref: countryTimeZoneMap in time zone data to understand the shape
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

// Ref: cityTimeZoneMap in time zone data to understand the shape
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

// Ref: zoneAndPhrasesMap in time zone data to understand the shape
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


function getLastPartOfTimeZone( tzName ) {
    if( tzName ) {
        const tzArr = tzName?.trim()?.split('/');
        return tzArr[tzArr.length-1]?.replaceAll('_',' ')?.trim();
    }
}

function findZone(search, tzList = []) {
    let searchPhrase = search?.trim();
    if (searchPhrase.includes(' ')) {
        searchPhrase = searchPhrase.replaceAll(' ', '_');
    }
    return tzList.filter( tzName => {
        if( tzName ) {
            const e = getLastPartOfTimeZone(tzName);
            return e.toLowerCase().includes(searchPhrase?.toLowerCase())
        }
    });
}

/**
    function getIndexOfZone(tz) {
        return tzList?.indexOf(tz);
    }

    function findZoneMatchInMap(tz, tzMap = null) {
        if( tzMap && tz ) {
            const index = getIndexOfZone(tz);
            const output = {
                [tz] : []
            };

            tzMap.forEach((zoneList, key) => {
                if(zoneList.includes(index)) {
                    output[tz].push(key);
                };
            });

            return output;
        }
    }

    function getCountryForZone(tzName) {
        return tzName && getCountriesForTimezone(tzName?.trim());
    }
 */

function findCountryForZone(tzSearchPhrase) {
    // TODO: POSSIBILY OF HAVING MORE TZNAME discarding for now.
    const [tzName] = findZone(tzSearchPhrase, tzList);
    const result = [];
    const searchMatchText = getLastPartOfTimeZone(tzName);
    countryTimeZoneMap
        .forEach( (tzList, key) => {
            if(tzList.includes(tzName)) {
                result.push({
                    ...DEFAULT_SHAPE,
                    phrase: searchMatchText,
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
 * zonePhrase - done
 */
function searchByPhrase(text) {
    
    const phrase = text?.trim();
    if( phrase ) {
      
        let result = [];

        const tzResult = searchByTzKeys(phrase);
        if( tzResult?.length ) {
            result = [ ...tzResult ];
        }

        const tzNameAbbrevResult = searchByTzNameAbbrevKeys(phrase);
        if( tzNameAbbrevResult?.length ) {
            result = [  ...result, ...tzNameAbbrevResult ];
        }

        const tzNameZoneResult = searchByTzNameKeys(phrase);
        if( tzNameZoneResult?.length ) {
            result = [  ...result, ...tzNameZoneResult ];
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
            return {
                result,
                err: false
            };
        }

        return {
            err: true,
            result: [DEFAULT_SHAPE]
        };
    }
}

export {
    searchByPhrase,
    getLastPartOfTimeZone
}