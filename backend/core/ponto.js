import { Router } from "express";

const pontoRouter = Router();

pontoRouter.get("/:data", async (req, res) => {
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

pontoRouter.post("/", async (req, res) => {
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

pontoRouter.put("/:data", async (req, res) => {
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

export { pontoRouter };