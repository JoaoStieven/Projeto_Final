import { Router } from "express";
import { auth } from "@ponto-certo/api/bin";
import { Employee } from "@ponto-certo/shared/model/employee";
const authRouter = Router();
authRouter.get("/", (req, res) => {
    if (auth.logged) {
        res.redirect(303, "/");
        return;
    }
    res.status(200).sendFile("entrar.html", { root: "./frontend/html" });
});
authRouter.post("/", async (req, res) => {
    try {
        new Employee({ id: 1, ...req.body });
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
    const employee = req.body;
    const success = await auth.authenticate(employee);
    if (!success) {
        res.status(401).json({ name: "EmployeeAuthError", message: "Failure at authentication: Invalid credentials" });
        return;
    }
    ;
    res.redirect(303, "/");
});
authRouter.put("/", async (req, res) => {
    if (!req.body.action || !/^(?:logoff|login)$/.test(req.body.action)) {
        res.status(400).json({ name: "EmployeeAuthError", message: "Failure at authentication: Unknown action" });
        return;
    }
    const action = req.body.action;
    if (action === "logoff") {
        await auth.leave();
        res.status(200).end();
        return;
    }
    ;
    if (action === "login") {
        if (!req.body.employee) {
            res.status(400).json({ name: "EmployeeAuthError", message: "Failure at authentication: Unknown employee" });
            return;
        }
        try {
            Employee.ensure({ id: 1, ...req.body.employee });
        }
        catch (err) {
            res.status(400).json({ name: "EmployeeAuthError", message: "Failure at authentication: Invalid employee data" });
            return;
        }
        if (auth.logged)
            await auth.leave();
        const employee = req.body.employee;
        const success = await auth.authenticate(employee);
        if (!success) {
            res.status(401).json({ name: "EmployeeAuthError", message: "Failure at authentication: Invalid credentials" });
            return;
        }
        ;
        res.redirect(303, "/");
        return;
    }
    ;
});
export { authRouter };
