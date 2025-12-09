import { createError } from "@ponto-certo/shared/func/error";

export class Time {
    private readonly hour: number;

    public constructor(hour: number){
        Time.ensure(hour);

        this.hour = hour;

        return this;
    }

    public value(){
        return this.toString();
    }

    public operate(...bind: Time[]){
        return (operation: (self: number, ...bounds: number[]) => number) => {
            const result = operation(this.hour, ...bind.map(time => time.hour));

            return new Time(result);
        };
    }

    public compare(...bind: Time[]){
        return (operation: (self: number, ...bounds: number[]) => boolean) => {
            const result = operation(this.hour, ...bind.map(time => time.hour));

            return result;
        };
    }

    private toString(){
        const hour = Math.floor(this.hour);
        const minute = Math.floor(Number.parseFloat((60*(this.hour - hour)).toFixed(3)));
        const second = Math.round(Number.parseFloat((3600*(this.hour - hour)).toFixed(3)) - Number.parseFloat((60*minute).toFixed(3)));

        const strHour = hour < 10 ? `0${hour}` : `${hour}`;
        const strMinute = minute < 10 ? `0${minute}` : `${minute}`;
        const strSecond = second < 10 ? `0${second}` : `${second}`;

        return `${strHour}:${strMinute}:${strSecond}`;
    }

    public static now(){
        const now = new Date();

        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        return new Time(hour + minute/60 + second/3600);
    }

    public static range(bounds: Time.Bounds): Time.Range {
        if(bounds.max) Time.ensure(bounds.max);
        if(bounds.min) Time.ensure(bounds.min);

        const usableBounds = { 
            min: bounds.min ? (typeof bounds.min === "string" ? Time.fromString(bounds.min).hour : bounds.min) : 0,
            max: bounds.max ? (typeof bounds.max === "string" ? Time.fromString(bounds.max).hour : bounds.max) : Time.fromString("23:59:59").hour
        };

        return { includes: (time: Time) => (usableBounds.min <= time.hour) && (time.hour <= usableBounds.max) };
    }

    public static fromString(timestring: string){
        if(typeof timestring !== "string") throw Time.Error.INVALID_TYPE;
        Time.ensure(timestring);

        const [hour, minute, second] = timestring.split(":").map(segment => Number.parseInt(segment));

        return new Time(hour + minute/60 + second/3600);
    }

    public static ensure(object: any): asserts object is number | string {
        if(typeof object !== "number" && typeof object !== "string") throw Time.Error.INVALID_TYPE;
        
        if(typeof object === "string"){
            if(!/^(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(object)) throw Time.Error.INVALID_TIMESTRING;
        }
        if(typeof object === "number"){
            if(Number.isNaN(object)) throw Time.Error.INVALID_NUMBER;
        }
    }
};

export namespace Time {
    const TimeError = createError("TimeError");

    export type Range = { includes: (time: Time) => boolean };
    export type Bounds = { min?: number | string, max?: number | string };

    export const Error = {
        INVALID_TYPE: TimeError("Invalid 'Time' conversion: Expected a 'string' or a 'number'"),
        INVALID_TIMESTRING: TimeError("Invalid 'Time' conversion: Expected a string with the format 'HH:MM:SS'"),
        INVALID_NUMBER: TimeError("Invalid 'Time' conversion: NaN was not expected")
    }
}