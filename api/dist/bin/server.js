import express from "express";
import { auth } from "@ponto-certo/api/bin";
import { employeeRouter } from "@ponto-certo/api/routes/employee";
import { workHourRouter, workHourDao } from "@ponto-certo/api/routes/workhour";
import { authRouter } from "@ponto-certo/api/routes/auth";
import { staticRouter } from "@ponto-certo/api/routes/static";
import { useTemplate } from "@ponto-certo/api/template/engine";
import { Date } from "@ponto-certo/shared/type/date";
import { WorkHour } from "@ponto-certo/shared/model/workhour";
import { Time } from "@ponto-certo/shared/type/time";
const app = express();
app.use(express.json(), express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/workhour", workHourRouter);
app.use("/", staticRouter);
app.get("/", async (req, res) => {
    if (!auth.logged) {
        res.redirect("/auth");
        return;
    }
    ;
    const user = auth.currentUser;
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
    if (workHours instanceof Error) {
        res.status(500).json({ name: workHours.name, message: workHours.message });
        return;
    }
    ;
    const todayWorkHours = workHours.find(workHour => workHour.date.value() === currentDate.value());
    if (!todayWorkHours) {
        const startWorkHour = new WorkHour({
            employee: user.id.value(),
            date: currentDate.value(),
            timezone: -3,
            entry_hour: currentTime.value(),
            exit_hour: "00:00:00",
            break: "00:00:00"
        });
        const success = await workHourDao.post(startWorkHour);
        if (success instanceof Error) {
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
    const indexTemplate = useTemplate("./backend/template/html/calcular.html", templateParams);
    res.status(200).contentType('text/html').send(indexTemplate).end();
});
app.listen(Number.parseInt(process.env.PORT), process.env.HOSTNAME, () => console.log("Vai tomar no teu cu Élder filho da puta"));
