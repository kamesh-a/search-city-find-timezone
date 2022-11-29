const { getCountryForTimezone } = require('countries-and-timezones')
/**
 * 
 * @returns {object} countryInfo
 *          {string} countryInfo.id - IN
 *          {string} countryInfo.name - India
 *          {string[]} countryInfo.timezones - [<zone-records>]
 */
function getCountryInfo( tzName ) {
    const zoneName = tzName?.trim();
    if( zoneName ) {
        const { id, name } = getCountryForTimezone(zoneName, { deprecated: false });
        return {
            id,
            name
        }
    }
}


module.exports = {
    getCountryInfo
}