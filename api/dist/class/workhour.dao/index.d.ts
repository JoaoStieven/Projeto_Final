import type { Database } from "@ponto-certo/api/contract/database";
import { WorkHour } from "@ponto-certo/shared/model/workhour";
import { Date } from "@ponto-certo/shared/type/date";
import { ID } from "@ponto-certo/shared/type/id";
export declare class WorkHourDAO {
    private static readonly tableName;
    private readonly database;
    constructor(database: Database);
    get<P extends [ID | Date] | [ID, Date]>(primaryKey: P): Promise<(P extends {
        length: 2;
    } ? WorkHour : WorkHour[]) | Error>;
    post(value: WorkHour): Promise<Error | WorkHour>;
    put(value: Partial<WorkHour.Core>, primaryKey: [ID, Date]): Promise<Error | WorkHour>;
    delete(primaryKey: [ID, Date]): Promise<Error | WorkHour>;
}
export declare namespace WorkHourDAO {
    const Error: {
        NOT_FOUND: Error;
    };
}
