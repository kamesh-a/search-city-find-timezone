/**
 * Build city to timezone
 * Build country to timezone
 * Build abbrevation to timezone
 * Build timezone to well known names
 */
 const {join} = require('path');
 const { 
        tzList, 
        countryTimeZoneMap, 
        cityTimeZoneMap, 
        tzAbbrevationMap, 
        zoneAndPhrasesMap 
    } = require("../timezone-data/tz-info");
    
 const { writeToFile } = require("./write-to-file");
 
 const memoizedTimezone = [];
 const transformedCountryTimeZoneMap = new Map();
 const transformedCityToTimeZoneMap = new Map();
 
 const path = join(__dirname, '../', 'dist', 'tz-info-compiled.js');
 
 function getTimeZoneIndex(tz) {
     return memoizedTimezone && memoizedTimezone.indexOf(tz);
 }
 
 function transformTimeZones(){
     return memoizedTimezone.push(...tzList);
 }
 
 function buildCityTimeZone( cityTimeZoneMap ){
     if(cityTimeZoneMap) {
         cityTimeZoneMap.forEach(( tzList, cityName ) => {
             const indexedTzList = tzList.map( tz => getTimeZoneIndex(tz));
             transformedCityToTimeZoneMap.set(cityName, indexedTzList);
         });
     }
 }
 
 function buildCountryTimeZone( countryTimeZoneMap ){
     if(countryTimeZoneMap) {
         countryTimeZoneMap.forEach(( tzList, countryName ) => {
             const indexedTzList = tzList.map( tz => getTimeZoneIndex(tz));
             transformedCountryTimeZoneMap.set(countryName, indexedTzList);
         });
     }
 }
 
 function buildTzAbbrevation( tzAbbrMap ){
     if(tzAbbrMap) {
         const indexedTzAbbrMap = new Map();
         tzAbbrMap.forEach(( tzList, abbrevation ) => {
             const indexedTzList = tzList.map( tz => getTimeZoneIndex(tz));
             indexedTzAbbrMap.set(abbrevation, indexedTzList);
         });
         return indexedTzAbbrMap;
     }
 }
 
 function buildTztoWellKnownPhrases( zoneWellKnownPhrasesMap ){
     if(zoneWellKnownPhrasesMap) {
         const indexedZonePhraseMap = new Map();
         zoneWellKnownPhrasesMap.forEach(( phraseList, tz ) => {
             const index = getTimeZoneIndex(tz);
             indexedZonePhraseMap.set(index, phraseList);
         });
         return indexedZonePhraseMap;
     }
 }
 
 transformTimeZones();
 buildCountryTimeZone(countryTimeZoneMap);
 buildCityTimeZone(cityTimeZoneMap);
 
 const indexedTzAbbrevationList = buildTzAbbrevation(tzAbbrevationMap);
 const indexedZoneAndPhrases = buildTztoWellKnownPhrases(zoneAndPhrasesMap);
 
 const str = `
     const tzList = ${JSON.stringify(memoizedTimezone)}; 
     const countryTimeZoneMap = new Map(${JSON.stringify([...transformedCountryTimeZoneMap])});
     const cityTimeZoneMap = new Map(${JSON.stringify([...transformedCityToTimeZoneMap])});
     const tzAbbrevationMap = new Map(${JSON.stringify([...indexedTzAbbrevationList])});
     const zoneAndPhrasesMap = new Map(${JSON.stringify([...indexedZoneAndPhrases])});
 
     module.exports = {
         tzList,
         countryTimeZoneMap,
         cityTimeZoneMap,
         tzAbbrevationMap,
         zoneAndPhrasesMap
     }
 `
 
 writeToFile(path, str)
     .then(() => console.log('done'))
     .catch(e => console.log(e));