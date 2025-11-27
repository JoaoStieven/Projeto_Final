import { createClient } from "@supabase/supabase-js";

export class FuncionarioDAO {
    dbConnection;

    constructor(){
        this.dbConnection = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

        return this;
    };

    async get(column, value){
        switch (column){
            case "id": {
                const { data, error } = await this.dbConnection.from("funcionario").select("*").eq(column, Number.parseInt(value));
    
                if (error) throw error;
            
                return data[0];
            };
            case "nome": {
                const { data, error } = await this.dbConnection.from("funcionario").select("*").eq(column, value);
    
                if (error) throw error;
            
                return data;
            };
            default: throw new Error("Erro ao buscar funcionários: Coluna de busca inválida.");
        };
    };
};