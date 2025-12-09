var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Date } from "@ponto-certo/shared/type/date";
import { Time } from "@ponto-certo/shared/type/time";
var today = Date.now().value();
var logoffBtn = document.getElementById("botao_vermelho");
var employeeID = document.getElementById("employeeID");
var hours = document.getElementById("hours");
var minutes = document.getElementById("minutes");
var seconds = document.getElementById("seconds");
logoffBtn.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
    var todayWorkHourFetch, _a, _b, workHour, workedHours, res, _c, _d, success, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, fetch("/workhour/".concat(employeeID.textContent, "/").concat(today))];
            case 1:
                todayWorkHourFetch = _g.sent();
                if (!!todayWorkHourFetch.ok) return [3 /*break*/, 3];
                _b = (_a = console).log;
                return [4 /*yield*/, todayWorkHourFetch.json()];
            case 2:
                _b.apply(_a, [_g.sent()]);
                return [2 /*return*/];
            case 3: return [4 /*yield*/, todayWorkHourFetch.json()];
            case 4:
                workHour = _g.sent();
                workedHours = Time.fromString("".concat(hours.textContent, ":").concat(minutes.textContent, ":").concat(seconds.textContent));
                return [4 /*yield*/, fetch("/workhour/".concat(employeeID.textContent, "/").concat(today), {
                        method: "PUT",
                        body: JSON.stringify({ exit_hour: workedHours.operate(workHour.entryHour, workHour.break)(function (a, b, c) { return a + b + c; }).value() }),
                        headers: { "Content-Type": "application/json" }
                    })];
            case 5:
                res = _g.sent();
                if (!!res.ok) return [3 /*break*/, 7];
                _d = (_c = console).log;
                return [4 /*yield*/, res.json()];
            case 6:
                _d.apply(_c, [_g.sent()]);
                return [2 /*return*/];
            case 7: return [4 /*yield*/, fetch("http://localhost:8080/auth", {
                    method: "PUT",
                    body: JSON.stringify({ action: "logoff" }),
                    headers: { "Content-Type": "application/json" }
                })];
            case 8:
                success = _g.sent();
                if (!!success.ok) return [3 /*break*/, 10];
                _f = (_e = console).log;
                return [4 /*yield*/, success.json()];
            case 9:
                _f.apply(_e, [_g.sent()]);
                return [2 /*return*/];
            case 10:
                ;
                window.location.assign("http://localhost:8080/auth");
                return [2 /*return*/];
        }
    });
}); });
export {};
