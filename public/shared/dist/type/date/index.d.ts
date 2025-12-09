export declare class Date {
    private static readonly monthRange;
    private static readonly dayRange;
    private static readonly leapYearDayRange;
    private readonly isLeapYear;
    private readonly units;
    constructor(...units: [year: number, month: number, day: number]);
    value(): string;
    addInterval(interval: Date.Interval): Date;
    static now(): Date;
    static range(bounds: Date.Bounds): Date.Range;
    static fromString(datestring: string): Date;
    static toString(year: number, month: number, day: number): string;
    static ensure(object: any): asserts object is string | [number, number, number];
    static isLeapYear(year: number): boolean;
}
export declare namespace Date {
    type Range = {
        includes: (date: Date) => boolean;
    };
    type Bounds = {
        min?: Date | string;
        max?: Date | string;
    };
    type Interval = {
        year?: number;
        month?: number;
        day?: number;
    };
    enum Month {
        JANUARY = 0,
        FEBRUARY = 1,
        MARCH = 2,
        APRIL = 3,
        MAY = 4,
        JUNE = 5,
        JULY = 6,
        AUGUST = 7,
        SEPTEMBER = 8,
        OCTOBER = 9,
        NOVEMBER = 10,
        DECEMBER = 11
    }
    const Error: {
        INVALID_TYPE: Error;
        INVALID_FORMAT: Error;
        INVALID_YEAR: Error;
        INVALID_MONTH: Error;
        INVALID_DAY: Error;
    };
}
