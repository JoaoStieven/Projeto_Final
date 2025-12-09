import { Time } from "@ponto-certo/shared/type/time";

const startBtn = document.getElementById("botao_verdebateponto") as HTMLButtonElement;

const hours = document.getElementById("hours") as HTMLDivElement;
const minutes = document.getElementById("minutes") as HTMLDivElement;
const seconds = document.getElementById("seconds") as HTMLDivElement;

let chronometer: NodeJS.Timeout | undefined;
let isTicking: boolean = false;

startBtn.addEventListener("click", () => {    
    if(isTicking){
        isTicking = false;

        clearInterval(chronometer);
        return;
    }

    isTicking = true;
    chronometer = setInterval(() => {
        const time = Time.fromString(`${hours.textContent}:${minutes.textContent}:${seconds.textContent}`);

        const newTime = time.operate(new Time(1/3600))((time, s) => time + s);

        const [nextHour, nextMinute, nextSecond] = newTime.value().split(":");

        hours.textContent = nextHour;
        minutes.textContent = nextMinute;
        seconds.textContent = nextSecond;

        return;
    }, 1000);
});