import { formatInTimeZone, format } from 'date-fns-tz';
import { DEFAULT_TZ_FORMAT, SHORT_TZ_FORMAT, COORDINATED_UNIVERSAL_TIME} from '../constants';

// Ref: https://date-fns.org/v2.29.3/docs/format
// Ref: https://bobbyhadz.com/blog/javascript-get-timezone-name

// const DEFAULT_TZ_FORMAT = 'yyyy-MM-dd__hh:mm:ss aaa__zzzz';
function getSystemTimezone() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tz = format( new Date(), 'zzzz');
    return {
        tzRaw: timeZone,
        tzFull: tz,
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

        if(tzAbbrevation.includes('GMT')) {
            return tzAbbrevation;
        }
        
        if(tzAbbrevation.toLowerCase().includes(COORDINATED_UNIVERSAL_TIME)){
            return 'UTC';
        }
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
