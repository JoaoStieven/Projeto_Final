import { createError } from "@ponto-certo/shared/func/error";

export class Date {
    private static readonly monthRange = Array.from({ length: 12 }, (_, monthPos) => monthPos + 1);
    private static readonly dayRange = {
        [0] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [1] : Array.from({ length: 28 }, (_, dayPos) => dayPos + 1),
        [2] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [3] : Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [4] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [5] : Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [6] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [7] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [8] : Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [9]: Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [10]: Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [11]: Array.from({ length: 31 }, (_, dayPos) => dayPos + 1)
    }
    private static readonly leapYearDayRange = {
        [0] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [1] : Array.from({ length: 29 }, (_, dayPos) => dayPos + 1),
        [2] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [3] : Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [4] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [5] : Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [6] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [7] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [8] : Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [9] : Array.from({ length: 31 }, (_, dayPos) => dayPos + 1),
        [10]: Array.from({ length: 30 }, (_, dayPos) => dayPos + 1),
        [11]: Array.from({ length: 31 }, (_, dayPos) => dayPos + 1)
    }

    private readonly isLeapYear: boolean;
    private readonly units: [number, Date.Month, number];

    public constructor(...units: [year: number, month: number, day: number]);

    public constructor(...units: number[]){
        Date.ensure(units);

        this.units = [units[0], units[1] - 1, units[2] - 1];
        this.isLeapYear = Date.isLeapYear(units[0]);

        return this;
    }

    public value(){
        return Date.toString(
            this.units[0], 
            Date.monthRange[this.units[1]],
            this.isLeapYear ? Date.leapYearDayRange[this.units[1]][this.units[2]] : Date.dayRange[this.units[1]][this.units[2]]
        );
    }

    public addInterval(interval: Date.Interval){
        const dayRange = this.isLeapYear ? Date.leapYearDayRange : Date.dayRange;
        
        const currentYear = this.units[0];
        const currentMonth = this.units[1];
        const currentDay = this.units[2];

        const year = interval.year ?? 0;
        const month = interval.month ?? 0;
        const day = interval.day ?? 0;

        //#region date magic

        let nextYear = currentYear;
        let nextMonth = currentMonth;
        let nextDay = (currentDay + day) % dayRange[currentMonth].length;

        if(currentDay + day > dayRange[currentMonth].length){
            nextMonth = (nextMonth + 1) % Date.monthRange.length;
            nextDay = nextDay % dayRange[nextMonth].length;

            if((currentDay + day) % dayRange[currentMonth].length > dayRange[nextMonth].length) {
                nextMonth += 1;
                if(currentMonth + month + 2 > Date.monthRange.length){
                    nextYear += 1;

                    nextMonth = (nextMonth + month) % Date.monthRange.length;
                    nextYear += year;

                    return new Date(nextYear, nextMonth + 1, nextDay + 1);
                }
            };
            if(currentMonth + month + 1 > Date.monthRange.length){
                nextYear += 1;

                nextMonth = (nextMonth + month) % Date.monthRange.length;
                nextYear += year;

                return new Date(nextYear, nextMonth + 1, nextDay + 1);
            }
        }
        if(currentMonth + month > Date.monthRange.length){ nextYear += 1 }

        nextMonth = (nextMonth + month) % Date.monthRange.length;
        nextYear += year;

        //#endregion date magic

        return new Date(nextYear, nextMonth + 1, nextDay + 1);
    }

    public static now(){
        const today = new globalThis.Date(globalThis.Date.now());

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        return new Date(year, month, day);
    }

    public static range(bounds: Date.Bounds): Date.Range {
        if(bounds.max && !(bounds.max instanceof Date)) Date.ensure(bounds.max);
        if(bounds.min && !(bounds.min instanceof Date)) Date.ensure(bounds.min);

        const usableUpperBound = bounds.max ? (typeof bounds.max === "string" ? Date.fromString(bounds.max) : bounds.max) : null;
        const usableLowerBound = bounds.min ? (typeof bounds.min === "string" ? Date.fromString(bounds.min) : bounds.min) : null;

        if(!usableUpperBound && !usableLowerBound) return { includes: () => true };

        if(!usableUpperBound){
            return {
                includes: (date) => {
                    const [year, month, day] = date.value();
                    const [minYear, minMonth, minDay] = usableLowerBound!.value();

                    if(year > minYear) return true;
                    if(year < minYear) return false;

                    if(month > minMonth) return true;
                    if(month < minMonth) return false;

                    if(day >= minDay) return true;

                    return false;
                }
            }
        };
        if(!usableLowerBound){
            return {
                includes: (date) => {
                    const [year, month, day] = date.value();
                    const [maxYear, maxMonth, maxDay] = usableUpperBound!.value();

                    if(year < maxYear) return true;
                    if(year > maxYear) return false;

                    if(month < maxMonth) return true;
                    if(month > maxMonth) return false;

                    if(day <= maxDay) return true;

                    return false;
                }
            }
        };
        return {
            includes: (date) => {
                const [year, month, day] = date.value();
                const [minYear, minMonth, minDay] = usableLowerBound.value();
                const [maxYear, maxMonth, maxDay] = usableUpperBound.value();

                if(minYear < year && year < maxYear) return true;
                if(minYear > year || year > maxYear) return false;

                if(minMonth < month && month < maxMonth) return true;
                if(minMonth > month || month > maxMonth) return false;

                if(minDay <= day && day <= maxDay) return true;
                if(minDay > day || day > maxDay) return false;

                return true;
            }
        };
    }

    public static fromString(datestring: string): Date {
        if(typeof datestring !== "string") throw Date.Error.INVALID_TYPE;
        Date.ensure(datestring);

        const [year, month, day] = datestring.split("-").map(unit => Number.parseInt(unit));

        return new Date(year, month, day);
    }

    public static toString(year: number, month: number, day: number){
        Date.ensure([year, month, day]);        

        const strYear = `${new Array(3 - Math.floor(Math.log10(year))).fill("0").join("")}${year}`;
        const strMonth = `${month < 10 ? 0 : ""}${month}`;
        const strDay = `${day < 10 ? 0 : ""}${day}`;

        return `${strYear}-${strMonth}-${strDay}`;
    }

    public static ensure(object: any): asserts object is string | [number, number, number] {
        if(typeof object !== "string" && !Array.isArray(object)) throw Date.Error.INVALID_TYPE;
        if(Array.isArray(object) && (object.length !== 3 || object.some(e => typeof e !== "number"))) throw Date.Error.INVALID_TYPE;
        if(typeof object === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(object)) throw Date.Error.INVALID_FORMAT;

        if(typeof object === "string"){
            const [year, month, day] = object.split("-").map(unit => Number.parseInt(unit));
            const isLeapYear = Date.isLeapYear(year);
            
            if(year < 0) throw Date.Error.INVALID_YEAR;
            if(month < 1 || month > Date.monthRange.length) throw Date.Error.INVALID_MONTH;

            const dayRange = isLeapYear ? Date.leapYearDayRange[month - 1 as Date.Month] : Date.dayRange[month - 1 as Date.Month];

            if(day < 1 || day > dayRange.length + 1) throw Date.Error.INVALID_DAY;
        };
        if(Array.isArray(object)){
            const [year, month, day] = object;

            const isLeapYear = Date.isLeapYear(year);

            if(year < 0) throw Date.Error.INVALID_YEAR;
            if(month < 1 || month > Date.monthRange.length) throw Date.Error.INVALID_MONTH;

            const dayRange = isLeapYear ? Date.leapYearDayRange[month - 1 as Date.Month] : Date.dayRange[month - 1 as Date.Month];

            if(day < 1 || day > dayRange.length + 1) throw Date.Error.INVALID_DAY;
        }
    }

    public static isLeapYear(year: number){
        return ((year % 4 === 0) && (year % 100 !== 0)) || ((year % 100 === 0) && (year % 400 === 0));
    }
}

export namespace Date {
    const DateError = createError("DateError");

    export type Range = { includes: (date: Date) => boolean };
    export type Bounds = { min?: Date | string, max?: Date | string };
    export type Interval = { year?: number; month?: number; day?: number };

    export enum Month {
        JANUARY = 0,
        FEBRUARY,
        MARCH,
        APRIL,
        MAY,
        JUNE,
        JULY,
        AUGUST,
        SEPTEMBER,
        OCTOBER,
        NOVEMBER,
        DECEMBER
    }
    
    export const Error = {
        INVALID_TYPE: DateError("Invalid 'Date' conversion: Expected a string or a number triplet"),
        INVALID_FORMAT: DateError("Invalid 'Date' conversion: Expected a string with the 'YYYY-MM-DD' format"),
        INVALID_YEAR: DateError("Invalid 'Date' conversion: Expected a non-negative year"),
        INVALID_MONTH: DateError("Invalid 'Date' conversion: Expected a month between January and December"),
        INVALID_DAY: DateError("Invalid 'Date' conversion: Expected a day between the range adopted by the month")
    }
}