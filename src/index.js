import { formatDate, getSystemTimezone } from './utils/date-helpers';
import { 
    getSystemTzInfo, 
    getTzInfoByTimeZoneName,
    getTimeWithCityCountryZoneName, 
} from './utils/compute-helpers';
import { getCountriesAndCapital } from './utils/country-helpers';

// TODO: Sort plugin - Done
// TODO: Prioritization plugin - Done
// TODO: Filer unique timezone plugin - done
// TODO: Flat the zonelist plugin - done

function sortPlugin( results ) {
    if( results?.length ) {
        return results.sort(( a,b ) => {
            const { countryName : aName } = a;
            const { countryName : bName } = b;
            return aName?.localeCompare(bName);
        });
    }
}

function priorityPlugin( results ) {
    const { tzFull } = getSystemTimezone();
    if( tzFull ) {
        const localizedResult = [...results];
        results
            .forEach(( rObj, i ) => {
                if( rObj?.tzFull?.trim() === tzFull?.trim()) {
                    const [record] = localizedResult.splice(i,1);
                    localizedResult.unshift(record);
                }
        })

        return localizedResult;
    }
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
        if( typeof userInputText === 'string' && userInputText?.trim() ) {
            const searchKey = userInputText.trim();
            const output = getTimeWithCityCountryZoneName(searchKey);
            if( output?.length ) {
                return priorityPlugin(sortPlugin(uniqueTzPlugin(flatPlugin(output))));
            }
        }
    }
    catch(e) {
        console.error(e);
    }
}

export {
    getSystemTzInfo,
    getCountriesAndCapital as getCountryTzInfo,
    getTzInfoByTimeZoneName as getTzInfoByTzName,
    computeTimeByCityOrCountryOrZone as searchTzInfo,
    formatDate
}