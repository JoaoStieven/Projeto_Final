import { ID } from "@ponto-certo/shared/type/id";
import { Name } from "@ponto-certo/shared/type/name";
import { Password } from "@ponto-certo/shared/type/password";
import { createError } from "@ponto-certo/shared/func/error";
import { toSnakecaseObject } from "@ponto-certo/shared/func/object";

export class Employee {
    public readonly id: ID;
    public readonly name: Name;
    public readonly password: Password;

    public constructor(data: Employee.Struct | object){
        Employee.ensure(data);
        
        this.id = new ID(data.id);
        this.name = new Name(data.name);
        this.password = new Password(data.password);

        return this;
    }

    public struct(): Employee.Core {
        return {
            id: this.id.value(),
            name: this.name.value(),
            password: this.password.value()
        } as Employee.Core;
    }

    public static ensure(object: any): asserts object is Employee.Struct {
        if(!object.id) throw Employee.Error.UNDEFINED_ID;
        if(!object.name) throw Employee.Error.UNDEFINED_NAME;
        if(!object.password) throw Employee.Error.UNDEFINED_PASSWORD;

        ID.ensure(object.id);
        Name.ensure(object.name);
        Password.ensure(object.password);
    }
};

export namespace Employee {
    const EmployeeError = createError("EmployeeError");

    export type Struct = { id: number, name: string, password: string };
    export type Core = { id: number, name: string, password: string };

    export const Error = {
        UNDEFINED_ID: EmployeeError("Invalid 'Employee' creation: Unknown ID"),
        UNDEFINED_NAME: EmployeeError("Invalid 'Employee' creation: Unknown name"),
        UNDEFINED_PASSWORD: EmployeeError("Invalid 'Employee' creation: Unknown password")
    };
};