import type { Auth } from "@ponto-certo/api/contract/auth";
import type { EmployeeDAO } from "@ponto-certo/api/class/employee.dao";
import type { Employee } from "@ponto-certo/shared/model/employee";

export class MemoryAuth implements Auth {
    private readonly dao: EmployeeDAO;
    private _currentUser?: Employee;
    private _logged: boolean;
    
    public constructor(dao: EmployeeDAO) {
        this.dao = dao;
        this._logged = false;

        return this;
    }

    get currentUser() {
        return this._currentUser;
    }

    get logged() {
        return this._logged;
    }

    public async authenticate(data: { name: string, password: string }) {
        if(this._logged) return false;

        const res = await this.dao.get();

        if (res instanceof Error) return false;

        const employee = res.filter(employee => employee.name.value() === data.name);

        if(employee.length === 0) return false;
        if(employee.length > 1) return false;
        if(employee[0].password.value() !== data.password) return false;
        
        this._currentUser = employee[0];
        this._logged = true;

        return true;
    }

    public async leave(): Promise<void> {
        if(!this._logged) return;

        this._currentUser = undefined;
        this._logged = false;

        return;
    }
}