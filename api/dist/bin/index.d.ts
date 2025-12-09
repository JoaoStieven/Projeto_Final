import type { Auth } from "@ponto-certo/api/contract/auth";
import type { Database } from "@ponto-certo/api/contract/database";
import { EmployeeDAO } from "@ponto-certo/api/class/employee.dao";
import { WorkHourDAO } from "@ponto-certo/api/class/workhour.dao";
export declare const db: Database;
export declare const employeeDao: EmployeeDAO;
export declare const workHourDao: WorkHourDAO;
export declare const auth: Auth;
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASE_URL: string;
            SUPABASE_KEY: string;
            PORT: string;
            HOSTNAME: string;
        }
    }
}
declare const app: import("express-serve-static-core").Express;
export { app };
