import { getCountryForTimezone } from 'countries-and-timezones';
import { countryAndCapitalMap } from '../../timezone-data/tz-info';
import { formatDate, getTzShortName } from './date-helpers';
import { COORDINATED_UNIVERSAL_TIME, UTC } from '../constants';

/**
 * 
 * @returns {object} countryInfo
 *          {string} countryInfo.id - IN
 *          {string} countryInfo.name - India
 *          {string[]} countryInfo.timezones - [<zone-records>]
 */
function getCountryInfo( tzName ) {
   try {
        const zoneName = tzName?.trim();
        if( zoneName ) {
            if(zoneName.includes(UTC)){
                return {
                    id: UTC, 
                    name: COORDINATED_UNIVERSAL_TIME
                }
            }
            const { id, name } = getCountryForTimezone(zoneName, { deprecated: false }) ?? {};
            return {
                id,
                name
            }
        } 
   } catch(e) {
        console.error(`error while getting country info ${e.stack}`)
   }
}

/**
 * 
 * if( tzName ) {
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
 */

// TODO: use memoize for one minute, because minutes won't change.
function getCountriesAndCapital() {
    if( countryAndCapitalMap?.size ) {
        const map = countryAndCapitalMap;
        const result = []
        map
         .forEach(({ capital, tzFull : tzRaw }, key) => {
            const formattedTime = formatDate(tzRaw);
            const { id: countryCode, name: countryName } = getCountryInfo(tzRaw);
            const [day,time,tzFullName] = formattedTime.split('__');
            
            if( countryName !== key ) {
                console.log(`We are seeing a mismatch country name ${key} - ${countryName} for zone ${tzRaw}`)
            }

            const info = {
                time,
                day,
                phrase: capital,
                countryCode,
                countryName: key,
                tzRaw,
                tzShort: getTzShortName(tzFullName),
                tzFull : tzFullName
            }
            result.push(info);
        });
        return result;
    } 
}


export {
    getCountryInfo,
    getCountriesAndCapital
}