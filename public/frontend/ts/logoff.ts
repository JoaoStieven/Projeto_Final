import type { WorkHour } from "@ponto-certo/shared/model/workhour";
import { Date } from "@ponto-certo/shared/type/date";
import { Time } from "@ponto-certo/shared/type/time";

const today = Date.now().value();

const logoffBtn = document.getElementById("botao_vermelho")! as HTMLButtonElement;
const employeeID = document.getElementById("employeeID") as HTMLElement;

const hours = document.getElementById("hours") as HTMLDivElement;
const minutes = document.getElementById("minutes") as HTMLDivElement;
const seconds = document.getElementById("seconds") as HTMLDivElement;

logoffBtn.addEventListener("click", async () => {
    const todayWorkHourFetch = await fetch(`/workhour/${employeeID.textContent}/${today}`);

    if(!todayWorkHourFetch.ok){
        console.log(await todayWorkHourFetch.json());

        return;
    }

    const workHour: WorkHour = await todayWorkHourFetch.json();
    const workedHours = Time.fromString(`${hours.textContent}:${minutes.textContent}:${seconds.textContent}`);

    const res = await fetch(`/workhour/${employeeID.textContent}/${today}`, {
        method: "PUT",
        body: JSON.stringify({ exit_hour: workedHours.operate(workHour.entryHour, workHour.break)((a, b, c) => a + b + c).value() }),
        headers: { "Content-Type": "application/json" }
    });

    if(!res.ok){
        console.log(await res.json());

        return;
    }

    const success = await fetch("http://localhost:8080/auth", {
        method: "PUT",
        body: JSON.stringify({ action: "logoff" }),
        headers: { "Content-Type": "application/json" }
    });

    if(!success.ok){
        console.log(await success.json());
        return;
    };

    window.location.assign("http://localhost:8080/auth");
});

export {};