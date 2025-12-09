import { createError } from "@ponto-certo/shared/func/error";

export class Timezone {
    private readonly tz: number;
    
    public constructor(timezone: number){
        Timezone.ensure(timezone);

        this.tz = timezone;

        return this;
    }

    public value(){
        return this.tz;
    }

    public operate(...bind: Timezone[]){
        return (operation: (self: number, ...bounds: number[]) => number) => {
            const result = operation(this.tz, ...bind.map(time => time.tz));

            return new Timezone(result % 12);
        };
    }

    public compare(...bind: Timezone[]){
        return (operation: (self: number, ...bounds: number[]) => boolean) => {
            const result = operation(this.tz, ...bind.map(time => time.tz));

            return result;
        };
    }

    public static range(bounds: Timezone.Bounds): Timezone.Range {
        if(bounds.max) Timezone.ensure(bounds.max);
        if(bounds.min) Timezone.ensure(bounds.min);

        const usableBounds = { 
            min: bounds.min ?? -12,
            max: bounds.max ?? 12
        };

        return { includes: (timezone: Timezone) => (usableBounds.min <= timezone.tz) && (timezone.tz <= usableBounds.max) };
    }

    public static ensure(object: any): asserts object is number {
        if(typeof object !== "number") throw Timezone.Error.INVALID_TYPE;
        if(Math.abs(object) > 12) throw Timezone.Error.INVALID_TIMEZONE_RANGE;
    }
}

export namespace Timezone {
    const TimezoneError = createError("TimezoneError");

    export type Range = { includes: (timezone: Timezone) => boolean };
    export type Bounds = { min?: number, max?: number };

    export const Error = {
        INVALID_TYPE: TimezoneError("Invalid 'Timezone' conversion: Expected a number"),
        INVALID_TIMEZONE_RANGE: TimezoneError("Invalid 'Timezone' conversion: Expected a number between -12 and 12")
    }
}