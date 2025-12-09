import type { Database } from "@ponto-certo/api/contract/database";

import { Employee } from "@ponto-certo/shared/model/employee";
import { ID } from "@ponto-certo/shared/type/id";
import { createError } from "@ponto-certo/shared/func/error";

export class EmployeeDAO {
    private readonly database: Database;
    
    public constructor(database: Database){
        this.database = database;

        return this;
    }

    public async get<P extends [ID] | undefined = undefined>(primaryKey?: P): Promise<(P extends [ID] ? Employee : Employee[]) | Error> {
        if(!primaryKey){
            const res = await this.database.select("employee");

            if(res instanceof Error) return res;

            return res.map(entry => new Employee(entry)) as P extends [ID] ? Employee : Employee[];
        }
        
        const [employeeID] = primaryKey;

        const res = await this.database.select("employee", [["id", employeeID.value()]]);

        if(res instanceof Error) return res;
        if(res.length === 0) return EmployeeDAO.Error.NOT_FOUND;

        return new Employee(res[0]) as P extends [ID] ? Employee : Employee[];
    }

    public async post(value: Employee){
        const res = await this.database.insert("employee", value.struct());

        if(res instanceof Error) return res;

        return new Employee(res);
    }

    public async put(value: Partial<Employee.Core>, primaryKey: [ID]){
        const [employeeID] = primaryKey;

        const res = await this.database.update("employee", value, [["id", employeeID.value()]]);

        if(res instanceof Error) return res;
        if(res.length === 0) return EmployeeDAO.Error.NOT_FOUND;

        return new Employee(res[0]);
    }

    public async delete(primaryKey: [ID]){
        const [employeeID] = primaryKey;

        const res = await this.database.delete("employee", [["id", employeeID.value()]]);

        if(res instanceof Error) return res;
        if(res.length === 0) return EmployeeDAO.Error.NOT_FOUND;

        return new Employee(res[0]);
    }
}

export namespace EmployeeDAO {
    const EmployeeDAOError = createError("EmployeeDAOError");
    
    export const Error = {
        NOT_FOUND: EmployeeDAOError("Failure at querying 'Employee': Not found")
    }
}