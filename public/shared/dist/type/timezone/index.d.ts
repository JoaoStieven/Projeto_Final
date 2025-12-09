export declare class Timezone {
    private readonly tz;
    constructor(timezone: number);
    value(): number;
    operate(...bind: Timezone[]): (operation: (self: number, ...bounds: number[]) => number) => Timezone;
    compare(...bind: Timezone[]): (operation: (self: number, ...bounds: number[]) => boolean) => boolean;
    static range(bounds: Timezone.Bounds): Timezone.Range;
    static ensure(object: any): asserts object is number;
}
export declare namespace Timezone {
    type Range = {
        includes: (timezone: Timezone) => boolean;
    };
    type Bounds = {
        min?: number;
        max?: number;
    };
    const Error: {
        INVALID_TYPE: Error;
        INVALID_TIMEZONE_RANGE: Error;
    };
}
