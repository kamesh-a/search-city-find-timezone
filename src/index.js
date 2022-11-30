import { getSystemTimezone } from './utils/date-helpers';
import { getTimeWithCityCountryZoneName } from './utils/compute-helpers';

// TODO: prioritization plugin
// TODO: filer unique timezone plugin - done
// TODO: flat the zonelist plugin - done

function priorityPlugin( results ) {
    const { tzRaw } = getSystemTimezone();
}

function uniqueTzPlugin( results ) {
    if( results && results.length ) {
        const timezones = new Set();
        return results
            .filter( infoObj => {
                const { tzRaw } = infoObj
                if( !timezones.has(tzRaw) ) {
                    timezones.add(tzRaw);
                    return true;
                }

                return false;
            });
    }
}

function flatPlugin( results ) {
    if( results && results.length ) {
        return results
            .map( searchObj => searchObj.tzList)
            .flat();
    }
}


function computeTimeByCityOrCountryOrZone( userInputText ) {
    try {
        if( typeof userInputText === 'string' ) {
            const searchKey = userInputText.trim();
            const output = getTimeWithCityCountryZoneName(searchKey);
            if( output?.length ) {
                return uniqueTzPlugin(flatPlugin(output));
            }
        }
    }
    catch(e) {
        console.error(e);
    }
}

export {
    computeTimeByCityOrCountryOrZone as getTzInfo 
}