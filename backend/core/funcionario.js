import { config } from "dotenv";
config({ path: "./.env" });

import { Router } from "express";
import { FuncionarioDAO } from "self/backend/class/funcionarioDAO.js";

const funcionarioRouter = Router();
const funcionarioDao = new FuncionarioDAO();

funcionarioRouter.get("/:param", async (req, res) => {
    try {
        if(/^\d+$/.test(req.params.param)){
            const id = req.params.param;

            const data = funcionarioDao.get("id", id);
    
            res.status(200).json(data[0]);

            return;
        };
        if(/^\w+$/.test(req.params.param)){
            const name = req.params.param;

            const data = funcionarioDao.get("nome", name);
    
            if (error) throw error;
    
            res.status(200).json(data[0]);

            return; 
        };
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar os dados: " + err.message });
    }

    return;
});

funcionarioRouter.post("/", async (req, res) => {
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

export { funcionarioRouter };