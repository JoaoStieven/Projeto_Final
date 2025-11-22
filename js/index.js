import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = "https://jmppzavxmtuwibpiudvh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHB6YXZ4bXR1d2licGl1ZHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTY0MjYsImV4cCI6MjA3ODYzMjQyNn0.ojLht-BfiFrwSQmu_MKhU5BGtwTH_YJvW91yXs5wg8o";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get("/funcionario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseClient.from("funcionario").select("*").eq("id", Number.parseInt(id));

    if (error) throw error;

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar os dados: " + err.message });
  }

  return;
});

app.post("/funcionario", async (req, res) => {
  try {
    const { id, nome, senha } = req.body;

    if (typeof id !== "number" || Number.isNaN(id)) return res.status(400).json({ message: "O ID do funcionário deve ser um número" });
    if (typeof nome !== "string") return res.status(400).json({ message: "O nome do funcionário deve ser uma sequência de caracteres" });
    if (typeof senha !== "string") return res.status(400).json({ message: "A senha do funcionário deve ser uma sequência de caracteres" });
    if (senha.length <= 4) return res.status(400).json({ message: "A senha do funcionário deve ter mais que 4 caracteres" });

    const { data, error } = await supabaseClient
      .from("funcionario")
      .insert([
        {
          id: id,
          nome: nome,
          senha: senha,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: "Erro ao inserir dados: " + err.message });
  }

  return;
});

app.get("/ponto/:data", async (req, res) => {
  try {
    const data_ = req.params.data;

    if (typeof data_ !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data_)) return res.status(400).json({ message: "A data deve seguir o formato YYYY-MM-DD" });

    const { data, error } = await supabaseClient.from("ponto").select("*").eq("data", data_).single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar os dados: " + err.message });
  }

  return;
});

app.post("/ponto", async (req, res) => {
  try {
    const { funcionario, fuso_horario, hora_entrada, hora_saida } = req.body;
    const data_ = req.body.data;

    if (typeof funcionario !== "number" || Number.isNaN(funcionario)) return res.status(400).json({ message: "O ID do funcionário deve ser um número" });

    if (typeof fuso_horario !== "number" || Math.abs(fuso_horario) > 12)
      return res.status(400).json({ message: "O fuso horário da região deve estar entre -12 e 12" });

    if (typeof data_ !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data_)) return res.status(400).json({ message: "A data deve seguir o formato 'YYYY-MM-DD'" });

    if (typeof hora_entrada !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(hora_entrada))
      return res.status(400).json({ message: "A hora de entrada deve ser no formato HH:MM:SS" });

    if (typeof hora_saida !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(hora_saida))
      return res.status(400).json({ message: "A hora de saida deve ser no formato HH:MM:SS" });

    const { data, error } = await supabaseClient
      .from("ponto")
      .insert([
        {
          funcionario: funcionario,
          data: data_,
          fuso_horario: fuso_horario,
          hora_entrada: hora_entrada,
          hora_saida: hora_saida,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: "Erro ao inserir dados: " + err.message });
  }

  return;
});

app.put("/ponto/:data", async (req, res) => {
  try {
    const { data } = req.params;
    const { funcionario, hora_saida } = req.body;

    if (typeof funcionario !== "number" || Number.isNaN(funcionario)) return res.status(400).json({ message: "O ID do funcionário deve ser um número" });
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return res.status(400).json({ message: "A data deve seguir o formato YYYY-MM-DD" });
    if (typeof hora_saida !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(hora_saida))
      return res.status(400).json({ message: "A hora de saida deve ser no formato HH:MM:SS" });

    const { error } = await supabaseClient
      .from("ponto")
      .update([
        {
          hora_saida: hora_saida,
        },
      ])
      .eq("funcionario", funcionario)
      .eq("data", data);

    if (error) throw error;

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar dados: " + err.message });
  }

  return;
});

// TODO: Alterar app.listen() para com vercel;

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
