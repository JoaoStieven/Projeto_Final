import type { Database } from "@ponto-certo/api/contract/database";
import { Employee } from "@ponto-certo/shared/model/employee";
import { ID } from "@ponto-certo/shared/type/id";
export declare class EmployeeDAO {
    private readonly database;
    constructor(database: Database);
    get<P extends [ID] | undefined = undefined>(primaryKey?: P): Promise<(P extends [ID] ? Employee : Employee[]) | Error>;
    post(value: Employee): Promise<Error | Employee>;
    put(value: Partial<Employee.Core>, primaryKey: [ID]): Promise<Error | Employee>;
    delete(primaryKey: [ID]): Promise<Error | Employee>;
}
export declare namespace EmployeeDAO {
    const Error: {
        NOT_FOUND: Error;
    };
}
