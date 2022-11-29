const { formatInTimeZone } = require('date-fns-tz');
const DEFAULT_TZ_FORMAT = 'yyyy-MM-dd hh:mm:ss aaa [zzzz]';

/**
 * 
 * @param {string} timeZoneAbbrevation - Pacific Standard Time
 * @returns {String} PST
 */
function getShortName(timeZoneAbbrevation) {
    if (timeZoneAbbrevation && timeZoneAbbrevation.includes(' ')) {
        return timeZoneAbbrevation.split(' ').reduce((a, c) => {
            return a + c.charAt(0);
        }, '').toUpperCase();
    }
}

/**
 * Convert a specific date to a particular timezone.
 * @param {string[]} timeZoneArrList = ["Europe/London", "America/New_York", ...]
 * @param {date} date = Provide date in case server based timezone
 * @returns {Object[]} results 
 */
function convertToTimeZone(timeZoneArrList, format = DEFAULT_TZ_FORMAT, date = new Date()) {
    const zones = [...timeZoneArrList];
    const results = zones.map(zone => {
        return {
            zone,
            time: formatInTimeZone(date, zone, format),
            stz: getShortName(formatInTimeZone(date, zone, 'zzzz'))
        }
    });

    return results;
}

module.exports = {
    convertToTimeZone
}