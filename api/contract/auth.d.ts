import type { Employee } from "@ponto-certo/shared/model/employee";

export interface Auth {
    readonly logged: boolean;
    readonly currentUser?: Employee;

    authenticate(data: { name: string, password: string }): Promise<boolean>;
    leave(): Promise<void>;
}