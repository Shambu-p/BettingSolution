import { isBooleanObject } from "util/types";
import FieldTypes from "../Enums/FiedTypes";
import UserRoles from "../Enums/UserRoles";
import UserState from "../Enums/UserState";
import * as ethiopianDate from "ethiopian-date";

function compareDates(sourceData: any, givenData: any, method: string) {

    if (!sourceData || !givenData) {
        throw new Error("Both sourceData and givenData must be valid ISO date strings.");
    }

    const sourceDate = new Date(sourceData);
    const givenDate = new Date(givenData);

    const sourceYear = sourceDate.getFullYear();
    const givenYear = givenDate.getFullYear();

    const sourceMonth = sourceDate.getMonth(); // Months are 0-indexed (0 = January)
    const givenMonth = givenDate.getMonth();

    const sourceDay = sourceDate.getDate();
    const givenDay = givenDate.getDate();

    switch (method) {
        case "date_month_year":
            return sourceYear == givenYear && sourceMonth == givenMonth && sourceDay == givenDay;
        case "month_year":
            return sourceYear == givenYear && sourceMonth == givenMonth;
        default:
            return sourceYear == givenYear;
    }

}

function compareData(sourceData: any, givenData: any, method: string) {
    
    if(["year", "month_year", "date_month_year"].includes(method)) {
        return compareDates(sourceData, givenData, method);
    }

    return (sourceData == givenData)

}

const Utils = {

    roleCheck(data1: string[], data2: string[]) {
        return (data2.filter((rl: string) => (data1.includes(rl))).length > 0)
    },

    formatPrice: (price: number, currency: string) => {
        // Truncate to 2 decimal places, do not round
        const truncated = Math.trunc(price * 100) / 100;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: 2
        }).format(truncated);
    },

    convertSecondsToDate(seconds: number) {
        const date = new Date(seconds * 1000);
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();

        return `${year}-${month}-${day}`;
        //  ${hours}:${minutes}:${second}`;
    },

    convertISOToDate(isoDateString: string, config: any = {
        type: "ethiopian", // Default date configuration
        format: "dd/mm/yy", // Default date format
        separater: "-" // Default date separator
    }) {

        if(!isoDateString || isoDateString == ""){
            return "";
        }
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // let ethDate = ethiopianDate.toEthiopian(year, parseInt(month), parseInt(day));
        // return `${ethDate[2]}-${ethDate[1]}-${ethDate[0]}`; // `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


        if(config.type == "gregorian") {
            if(config.format == "dd/mm/yy") {
                // Combine to form the desired format for input value
                return `${year}${config.separater}${month}${config.separater}${day}`;
            } else if(config.format == "mm/dd/yy") {
                // Swap month and day for mm/dd/yyyy format
                return `${month}${config.separater}${day}${config.separater}${year}`;
            } else if(config.format == "yy/mm/dd") {
                // Swap year and month for yyyy/mm/dd format
                return `${year}${config.separater}${month}${config.separater}${day}`;
            }
        } else {
            let ethDate = ethiopianDate.toEthiopian(year, parseInt(month), parseInt(day));

            if(config.format == "dd/mm/yy") {
                // Combine to form the desired format for input value
                return `${ethDate[2]}${config.separater}${ethDate[1]}${config.separater}${ethDate[0]}`;
            } else if(config.format == "mm/dd/yy") {
                // Swap month and day for mm/dd/yyyy format
                return `${ethDate[1]}${config.separater}${ethDate[2]}${config.separater}${ethDate[0]}`;
            } else if(config.format == "yy/mm/dd") {
                // Swap year and month for yyyy/mm/dd format
                return `${ethDate[0]}${config.separater}${ethDate[1]}${config.separater}${ethDate[2]}`;
            }
        }
    },

    isoToDateTimeLocal(isoString: string) {
        const date = new Date(isoString);
    
        // Extract the date and time parts in the correct format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        // Combine to form the desired format for input value
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    dateInputFormat(isoString: string) {
        const date = new Date(isoString);
    
        // Extract the date and time parts in the correct format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        // Combine to form the desired format for input value
        return `${year}-${month}-${day}`;
    },
    isoToReadableDateTime(isoString: string, config: any = {
        type: "ethiopian", // Default date configuration
        format: "dd/mm/yy", // Default date format
        separater: "-" // Default date separator
    }) {
        const date = new Date(isoString);
    
        // Extract the date and time parts in the correct format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    

        if(config.type == "gregorian") {
            if(config.format == "dd/mm/yy") {
                // Combine to form the desired format for input value
                return `${year}${config.separater}${month}${config.separater}${day} ${hours}:${minutes}`;
            } else if(config.format == "mm/dd/yy") {
                // Swap month and day for mm/dd/yyyy format
                return `${month}${config.separater}${day}${config.separater}${year} ${hours}:${minutes}`;
            } else if(config.format == "yy/mm/dd") {
                // Swap year and month for yyyy/mm/dd format
                return `${year}${config.separater}${month}${config.separater}${day} ${hours}:${minutes}`;
            }
        } else {
            let ethDate = ethiopianDate.toEthiopian(year, parseInt(month), parseInt(day));

            if(config.format == "dd/mm/yy") {
                // Combine to form the desired format for input value
                return `${ethDate[2]}${config.separater}${ethDate[1]}${config.separater}${ethDate[0]} ${hours}:${minutes}`;
            } else if(config.format == "mm/dd/yy") {
                // Swap month and day for mm/dd/yyyy format
                return `${ethDate[1]}${config.separater}${ethDate[2]}${config.separater}${ethDate[0]} ${hours}:${minutes}`;
            } else if(config.format == "yy/mm/dd") {
                // Swap year and month for yyyy/mm/dd format
                return `${ethDate[0]}${config.separater}${ethDate[1]}${config.separater}${ethDate[2]} ${hours}:${minutes}`;
            }
        }

    },

    dateToSeconds(date: string): (null | number) {
        // return Math.floor(new Date(date).getTime()/1000);
        const timestampInMilliseconds = Date.parse(date);

        if (isNaN(timestampInMilliseconds)) {
            console.error("Invalid date string");
            return null;
        }

        const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);
        return timestampInSeconds;
    },

    dateToISO(dateString: string, for_server = true): (null | string) {

        try{
            const date = new Date(`${dateString}${for_server ? "Z" : ""}`);
            const formattedDate = date.toISOString(); // Generates 'YYYY-MM-DDTHH:mm:ss.SSSZ' format
            return formattedDate;
        }catch(error: any){
            return null;
        }

    },

    getFromArray(id: any, value: any, getId: any, list: any[]): string {
        let found = list.find(ls => (ls[id] == value));

        return found ? found[getId] : "unknown";
    },

    objectToQueryString: function (obj: any) {
        const queryParams = [];

        for (const key in obj) {
            // let vl = obj[key] != "" ? obj[key].split("|") : [];
            //&& obj.hasOwnProperty(key)
            if (obj[key].value != undefined && obj[key].operator != "" && obj[key].value != "" && obj[key].type != "") {
                const value = encodeURIComponent(`${obj[key].value}`);
                // const value = encodeURIComponent(`${obj[key].operator}|${obj[key].type}|${obj[key].value}`);
                queryParams.push(`${key}=${value}`);
            }
        }

        return queryParams.join('&');
    },
    objectToQueryObject: function (obj: any) {

        const queryParams: any = {};

        for (const key in obj) {
            if (obj[key].value != undefined && obj[key].operator != "" && obj[key].value != "" && obj[key].type != "") {
                if([FieldTypes.DATE, FieldTypes.DATETIME].includes(obj[key].type)) {
                    queryParams[key] = {
                        [obj[key].operator]: this.dateToISO(obj[key].value, false)
                    };
                } else if([FieldTypes.NUMBER, FieldTypes.FLOAT].includes(obj[key].type)) {
                    queryParams[key] = {
                        [obj[key].operator]: parseFloat(`${obj[key].value}`)
                    };
                } else {
                    queryParams[key] = {
                        [obj[key].operator]: obj[key].value
                    };
                }
            }
        }

        return queryParams;

    },

    getVariableData: function (expression: string, objectData: any) {

        let properties = expression.split(".");
        let temp_data = objectData;

        properties.forEach(prop => {

            if(!temp_data[prop]) {
                console.log(`get dynamic variable data error: the property named ${expression} not found!`);
            }

            temp_data = temp_data[prop];

        });

        // if(typeof temp_data == "string" || typeof temp_data != "boolean" || typeof temp_data != "symbol" || typeof temp_data != "undefined") {
        //     return `${temp_data}`.replace(".", "###",);
        // } else {
        //     return temp_data;
        // }
        return temp_data;

    },

    findGroup: function (heyStack: any, property: string, method: string) {

        let keys = Object.keys(heyStack);
        // console.log(`searching for ${property}`, keys)
        let foundKey = {
            key: property,
            isFound: false
        };

        let givenProp = property.split("##").pop();

        for(let key of keys) {

            if(compareData((`${key}`.split("##").pop()), givenProp, method)) {
                foundKey = {
                    key,
                    isFound: true
                };
            }

        };

        return foundKey;

    },

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    ceilOrTruncate(num: number): number {
        const fraction = num - Math.trunc(num);
        if (fraction > 0.5) {
            return Math.ceil(num);
        } else {
            // Truncate to two decimal places without rounding
            return Math.trunc(num * 100) / 100;
        }
    },
    isSameDay(date1: string, date2: string): boolean {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    },

    /**
 * Converts a string to PascalCase.
 * Example: "my component name" => "MyComponentName"
 */
toPascalCase(str: string): string {
  return str
    .replace(/([_\-\s]+)(.)?/g, (_, __, chr) => chr ? chr.toUpperCase() : "")
    .replace(/^(.)/, (m) => m.toUpperCase());
}

}

export default Utils;