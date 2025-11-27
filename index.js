import express from "express";
import cors from "cors";

import { staticRouter } from "./backend/core/static.js";
import { funcionarioRouter } from "./backend/core/funcionario.js";
import { pontoRouter } from "./backend/core/ponto.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", staticRouter);
app.use("/funcionario", funcionarioRouter);
app.use("/ponto", pontoRouter);

app.listen(8080, "localhost", () => console.log("Teste foda"));

/**
 * Os testes aí
 *
 * $funcionario = @{ id = 1; nome = "Teste"; senha = "Foda" } | ConvertTo-Json;
 *
 * POST funcionario: Invoke-WebRequest -Uri "http://localhost:8080/funcionario" -Method POST -Body $funcionario -ContentType "application/json"
 * GET funcionario: Invoke-WebRequest -Uri "http://localhost:8080/funcionario/1" -Method GET
 *
 * $ponto = @{ funcionario = 1; data = '2025-11-22'; fuso_horario = -3; hora_entrada = '08:00:00'; hora_saida = '17:00:00' } | ConvertTo-Json
 * $pontoAtualizacao = @{ hora_saida = '14:00:00' } | ConvertTo-Json
 *
 * POST ponto: Invoke-WebRequest -Uri "http://localhost:8080/ponto" -Method POST -Body $ponto -ContentType "application/json"
 * GET ponto: Invoke-WebRequest -Uri "http://localhost:8080/ponto/2025-11-22" -Method GET
 * PUT ponto: Invoke-WebRequest -Uri "http://localhost:8080/ponto/2025-11-22" -Method PUT -Body $pontoAtualizacao -ContentType "application/json"
 */
