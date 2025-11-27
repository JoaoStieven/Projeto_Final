export class Funcionario {
    id = 0
    nome = "";
    senha = "";

    constructor(data){
        if(!data.id || !/^\d+$/.test(data.id)) throw new TypeError("O ID do funcionário deve ser um número.");
        if(!data.nome || typeof data.nome !== "string" || !/^(?:[a-zA-Z]| )+$/.test(data.nome)) throw new TypeError("O nome do funcionário deve ser uma sequência de caracteres.");
        if(!data.senha || typeof data.senha !== "string" || !/^\w+$/.test(data.senha)) throw new TypeError("A senha do funcionário deve ser uma sequência de caracteres.");

        this.id = data.id;
        this.nome = data.nome;
        this.senha = data.senha;

        return this;
    };
};