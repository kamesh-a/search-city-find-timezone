import { formatInTimeZone, format } from 'date-fns-tz';

const DEFAULT_TZ_FORMAT = 'yyyy-MM-dd__hh:mm:ss aaa__zzzz';
const TIME_FORMAT = 'hh:mm:ss aaa';
const SHORT_TZ_FORMAT = 'zzzz';

function getSystemTimezone() {
    const tz = format( new Date(), 'zzzz');
    return {
        tzRaw: tz,
        tzShort: getTzShortName(tz)
    }
}

/**
 * 
 * @param {string} tzAbbrevation - Indian Standard Time
 * @returns {String} IST
 */
function getTzShortName(tzAbbrevation) {
    if (tzAbbrevation) {
        const tzFullName = tzAbbrevation?.trim();
        return tzFullName.split(' ').reduce((a, c) => {
            return a + c.charAt(0);
        }, '').toUpperCase();
    }
}

function getTzFullName(zoneName,  date = new Date(), format = SHORT_TZ_FORMAT) {
    return formatDate(zoneName, date, format);
}

/**
 * Convert a specific date to a particular timezone.
 * @param {string} zoneName - Asia/Kolkata
 * @param {date} date = Provide date in case server based timezone
 * @returns {string} formated string 
 */
function formatDate(zoneName, date = new Date(), format = DEFAULT_TZ_FORMAT) {
    return format && formatInTimeZone(date, zoneName, format)
}

export {
    formatDate,
    getTzShortName,
    getTzFullName,
    getSystemTimezone
}
