import { getCountryForTimezone } from 'countries-and-timezones';
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


export {
    getCountryInfo
}