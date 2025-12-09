import { ID } from "@ponto-certo/shared/type/id";
import { Name } from "@ponto-certo/shared/type/name";
import { Password } from "@ponto-certo/shared/type/password";
export declare class Employee {
    readonly id: ID;
    readonly name: Name;
    readonly password: Password;
    constructor(data: Employee.Struct | object);
    struct(): Employee.Core;
    static ensure(object: any): asserts object is Employee.Struct;
}
export declare namespace Employee {
    type Struct = {
        id: number;
        name: string;
        password: string;
    };
    type Core = {
        id: number;
        name: string;
        password: string;
    };
    const Error: {
        UNDEFINED_ID: Error;
        UNDEFINED_NAME: Error;
        UNDEFINED_PASSWORD: Error;
    };
}
