export declare class Time {
    private readonly hour;
    constructor(hour: number);
    value(): string;
    operate(...bind: Time[]): (operation: (self: number, ...bounds: number[]) => number) => Time;
    compare(...bind: Time[]): (operation: (self: number, ...bounds: number[]) => boolean) => boolean;
    private toString;
    static now(): Time;
    static range(bounds: Time.Bounds): Time.Range;
    static fromString(timestring: string): Time;
    static ensure(object: any): asserts object is number | string;
}
export declare namespace Time {
    type Range = {
        includes: (time: Time) => boolean;
    };
    type Bounds = {
        min?: number | string;
        max?: number | string;
    };
    const Error: {
        INVALID_TYPE: Error;
        INVALID_TIMESTRING: Error;
        INVALID_NUMBER: Error;
    };
}
