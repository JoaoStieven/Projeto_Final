import type { Auth } from "@ponto-certo/api/contract/auth";
import type { EmployeeDAO } from "@ponto-certo/api/class/employee.dao";
import type { Employee } from "@ponto-certo/shared/model/employee";
export declare class MemoryAuth implements Auth {
    private readonly dao;
    private _currentUser?;
    private _logged;
    constructor(dao: EmployeeDAO);
    get currentUser(): Employee | undefined;
    get logged(): boolean;
    authenticate(data: {
        name: string;
        password: string;
    }): Promise<boolean>;
    leave(): Promise<void>;
}
