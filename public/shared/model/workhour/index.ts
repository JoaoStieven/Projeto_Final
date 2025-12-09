import { Date } from "@ponto-certo/shared/type/date";
import { ID } from "@ponto-certo/shared/type/id";
import { Time } from "@ponto-certo/shared/type/time";
import { Timezone } from "@ponto-certo/shared/type/timezone";
import { createError } from "@ponto-certo/shared/func/error";
import { toSnakecaseObject } from "@ponto-certo/shared/func/object";

export class WorkHour {
    public static readonly overtimeThreshold = 8;

    public readonly employee: ID;
    public readonly date: Date;
    public readonly timezone: Timezone;
    public readonly entryHour: Time;
    public readonly exitHour: Time;
    public readonly break: Time;
    public readonly workedHours: Time;
    public readonly overtime: Time;

    public constructor(data: WorkHour.Struct | object){
        WorkHour.ensure(data);

        this.employee = new ID(data.employee);
        this.date = Date.fromString(data.date);
        this.timezone = new Timezone(data.timezone);
        this.entryHour = Time.fromString(data.entry_hour);
        this.exitHour = Time.fromString(data.exit_hour);
        this.break = Time.fromString(data.break);

        if(data.worked_hours){ this.workedHours = Time.fromString(data.worked_hours) }
        else {
            this.workedHours = this.exitHour.operate(this.entryHour, this.break)((exit, entry, recess) => exit - (entry + recess));
        }
        if(data.overtime){ this.overtime = Time.fromString(data.overtime) }
        else {
            this.overtime = this.exitHour.operate(this.workedHours)((exit, worked) => Math.max(0, exit - (worked + WorkHour.overtimeThreshold)));
        }

        return this;
    }

    public struct(): WorkHour.Core {
        return {
            employee: this.employee.value(),
            date: this.date.value(),
            timezone: this.timezone.value(),
            entry_hour: this.entryHour.value(),
            exit_hour: this.exitHour.value(),
            break: this.break.value()
        } as WorkHour.Core
    }

    public static ensure(object: any): asserts object is WorkHour.Struct {
        if(!object.employee) throw WorkHour.Error.UNKNOWN_EMPLOYEE;
        if(!object.date) throw WorkHour.Error.UNKNOWN_DATE;
        if(!object.timezone) throw WorkHour.Error.UNKNOWN_TIMEZONE;
        if(!object.entry_hour) throw WorkHour.Error.UNKNOWN_ENTRY_HOUR;
        if(!object.exit_hour) throw WorkHour.Error.UNKNONW_EXIT_HOUR;
        if(!object.break) throw WorkHour.Error.UNKNOWN_BREAK;

        ID.ensure(object.employee);
        Date.ensure(object.date);
        Timezone.ensure(object.timezone);
        Time.ensure(object.entry_hour);
        Time.ensure(object.exit_hour);
        Time.ensure(object.break);

        object.worked_hours ? Time.ensure(object.worked_hours) : 0;
        object.overtime ? Time.ensure(object.overtime) : 0;
    }
};

export namespace WorkHour {
    const WorkHourError = createError("WorkHourError");

    export type Struct = {
        employee: number,
        date: string,
        timezone: number,
        entry_hour: string,
        exit_hour: string,
        break: string,
        worked_hours?: string,
        overtime?: string
    }

    export type Core = {
        employee: number,
        date: string,
        timezone: number,
        entry_hour: string,
        exit_hour: string,
        break: string
    }

    export const Error = {
        UNKNOWN_EMPLOYEE: WorkHourError("Invalid 'WorkHour' creation: Unknown employee"),
        UNKNOWN_DATE: WorkHourError("Invalid 'WorkHour' creation: Unknown date"),
        UNKNOWN_TIMEZONE: WorkHourError("Invalid 'WorkHour' creation: Unknown timezone"),
        UNKNOWN_ENTRY_HOUR: WorkHourError("Invalid 'WorkHour' creation: Unknown entry hour"),
        UNKNONW_EXIT_HOUR: WorkHourError("Invalid 'WorkHour' creation: Unknown exit hour"),
        UNKNOWN_BREAK: WorkHourError("Invalid 'WorkHour' creation: Unknown work break")
    }
};