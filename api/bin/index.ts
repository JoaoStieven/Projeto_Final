import type { Auth } from "@ponto-certo/api/contract/auth";
import type { Database } from "@ponto-certo/api/contract/database";

import express from "express";
import cors from "cors";

import { SupabaseDatabase } from "@ponto-certo/api/database/supabase";
import { MemoryAuth } from "@ponto-certo/api/auth/memory";
import { useTemplate } from "@ponto-certo/api/template/engine";

import { EmployeeDAO } from "@ponto-certo/api/class/employee.dao";
import { WorkHourDAO } from "@ponto-certo/api/class/workhour.dao";

import { authRouter } from "@ponto-certo/api/routes/auth";
import { employeeRouter } from "@ponto-certo/api/routes/employee";
import { workHourRouter } from "@ponto-certo/api/routes/workhour";
import { staticRouter } from "@ponto-certo/api/routes/static";

import { WorkHour } from "@ponto-certo/shared/model/workhour";

import { Date } from "@ponto-certo/shared/type/date";
import { Time } from "@ponto-certo/shared/type/time";

export const db: Database = new SupabaseDatabase(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const employeeDao = new EmployeeDAO(db);
export const workHourDao = new WorkHourDAO(db);

export const auth: Auth = new MemoryAuth(employeeDao);

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

const app = express();

app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/workhour", workHourRouter);
app.use("/", staticRouter);

app.get("/", async (req, res) => {
    if(!auth.logged){
        res.redirect("/auth");
    }

    const user = auth.currentUser!;

    const templateParams = {
        id: `${user.id.value()}`,
        name: user.name.value(),
        hours: "00",
        minutes: "00",
        seconds: "00",
        overtime: "00:00:00",
        day_worked_hours: "00:00:00"
    };

    const currentDate = Date.now();
    const currentTime = Time.now();
    
    const workHours = await workHourDao.get([user.id]);

    if(workHours instanceof Error){
        res.status(500).json({ name: workHours.name, message: workHours.message });

        return;
    };
    
    const todayWorkHours = workHours.find(workHour => workHour.date.value() === currentDate.value());

    if(!todayWorkHours){
        const startWorkHour = new WorkHour({
            employee: user.id.value(),
            date: currentDate.value(),
            timezone: -3,
            entry_hour: currentTime.value(),
            exit_hour: "00:00:00",
            break: "00:00:00"
        });

        const success = await workHourDao.post(startWorkHour);

        if(success instanceof Error){
            res.status(500).json({ name: success.name, message: success.message });

            return;
        }

        const indexTemplate = useTemplate("./backend/template/html/calcular.html", templateParams);

        res.status(200).contentType('text/html').send(indexTemplate).end();

        return;
    }

    const [hours, minutes, seconds] = todayWorkHours.workedHours.value().split(":");
        
    templateParams["hours"] = hours;
    templateParams["minutes"] = minutes;
    templateParams["seconds"] = seconds;
    templateParams["day_worked_hours"] = `${hours}:${minutes}:${seconds}`;
    templateParams["overtime"] = todayWorkHours.overtime.value();

    const indexTemplate = useTemplate("/backend/template/html/calcular.html", templateParams);

    res.status(200).contentType('text/html').send(indexTemplate).end();
});

export { app };