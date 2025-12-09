import type { Database } from "@ponto-certo/api/contract/database";
import { createError } from "@ponto-certo/shared/func/error";

import { WorkHour } from "@ponto-certo/shared/model/workhour";
import { Date } from "@ponto-certo/shared/type/date";
import { ID } from "@ponto-certo/shared/type/id";

export class WorkHourDAO {
    private static readonly tableName = "work_hour";
    private readonly database: Database;

    public constructor(database: Database){
        this.database = database;

        return this;
    }

    public async get<P extends [ID | Date] | [ID, Date]>(primaryKey: P): Promise<(P extends { length: 2 } ? WorkHour : WorkHour[]) | Error>{
        if(primaryKey.length === 1){
            const paramName = primaryKey[0] instanceof ID ? "employee" : "date";
            const paramValue = primaryKey[0].value();

            const res = await this.database.select(WorkHourDAO.tableName, [[paramName, paramValue]]);

            if(res instanceof Error) return res;

            return res.map(entry => new WorkHour(entry)) as P extends { length: 2 } ? WorkHour : WorkHour[];
        };
        
        const [employeeID, date] = primaryKey.map(i => i.value());

        const res = await this.database.select(WorkHourDAO.tableName, [["employee", employeeID], ["date", date]]);

        if(res instanceof Error) return res;
        if(res.length === 0) return WorkHourDAO.Error.NOT_FOUND;

        return new WorkHour(res[0]) as P extends { length: 2 } ? WorkHour : WorkHour[];
    }

    public async post(value: WorkHour){
        const res = await this.database.insert(WorkHourDAO.tableName, value.struct());

        if(res instanceof Error) return res;

        return new WorkHour(res);
    }

    public async put(value: Partial<WorkHour.Core>, primaryKey: [ID, Date]){
        const [employeeID, date] = primaryKey.map(i => i.value());
        
        const res = await this.database.update(WorkHourDAO.tableName, value, [["employee", employeeID], ["date", date]])

        if(res instanceof Error) return res;
        if(res.length === 0) return WorkHourDAO.Error.NOT_FOUND;

        return new WorkHour(res[0]);
    }

    public async delete(primaryKey: [ID, Date]){
        const [employeeID, date] = primaryKey.map(i => i.value());

        const res = await this.database.delete(WorkHourDAO.tableName, [["employee", employeeID], ["date", date]]);

        if(res instanceof Error) return res;
        if(res.length === 0) return WorkHourDAO.Error.NOT_FOUND;

        return new WorkHour(res[0]);
    }
}

export namespace WorkHourDAO {
    const WorkHourDAOError = createError("WorkHourDAOError");
    
    export const Error = {
        NOT_FOUND: WorkHourDAOError("Failure at querying 'WorkHour': Not found")
    }
}