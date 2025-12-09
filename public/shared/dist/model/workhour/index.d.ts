import { Date } from "@ponto-certo/shared/type/date";
import { ID } from "@ponto-certo/shared/type/id";
import { Time } from "@ponto-certo/shared/type/time";
import { Timezone } from "@ponto-certo/shared/type/timezone";
export declare class WorkHour {
    static readonly overtimeThreshold = 8;
    readonly employee: ID;
    readonly date: Date;
    readonly timezone: Timezone;
    readonly entryHour: Time;
    readonly exitHour: Time;
    readonly break: Time;
    readonly workedHours: Time;
    readonly overtime: Time;
    constructor(data: WorkHour.Struct | object);
    struct(): WorkHour.Core;
    static ensure(object: any): asserts object is WorkHour.Struct;
}
export declare namespace WorkHour {
    type Struct = {
        employee: number;
        date: string;
        timezone: number;
        entry_hour: string;
        exit_hour: string;
        break: string;
        worked_hours?: string;
        overtime?: string;
    };
    type Core = {
        employee: number;
        date: string;
        timezone: number;
        entry_hour: string;
        exit_hour: string;
        break: string;
    };
    const Error: {
        UNKNOWN_EMPLOYEE: Error;
        UNKNOWN_DATE: Error;
        UNKNOWN_TIMEZONE: Error;
        UNKNOWN_ENTRY_HOUR: Error;
        UNKNONW_EXIT_HOUR: Error;
        UNKNOWN_BREAK: Error;
    };
}
