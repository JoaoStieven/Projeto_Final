import { Router } from "express";
const staticRouter = Router();
staticRouter.get("/html/:file", (req, res) => {
    res.contentType("text/html").sendFile(req.path, { root: "/frontend" });
});
staticRouter.get("/css/:file", (req, res) => {
    res.contentType("text/css").sendFile(req.path, { root: "/frontend" });
});
staticRouter.get("/js/:file", (req, res) => {
    if (!/.js$/.test(req.params.file)) {
        res.contentType("text/javascript").sendFile(req.path + ".js", { root: "/frontend" });
        return;
    }
    res.contentType("text/javascript").sendFile(req.path, { root: "/frontend" });
});
staticRouter.get("/shared/{*string}", (req, res) => {
    const file = req.path.replace(/^\/shared/, "") + "/index.js";
    res.contentType("text/javascript").sendFile(file, { root: "./shared/dist" });
});
staticRouter.get("/files/:file", (req, res) => {
    res.sendFile(req.params.file, { root: "/frontend/resource" });
});
export { staticRouter };
