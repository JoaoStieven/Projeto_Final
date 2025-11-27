export class Ponto {
    funcionario = 0;
    data = "";
    hora_entrada = "";
    hora_saida = "";
    fuso_horario = "";
    horas_trabalhadas = "";
    horas_extras = "";

    constructor(data){
        if(typeof data.funcionario !== "number") throw new TypeError("O ID do funcionário que registrou o ponto deve ser um número.");
        if(typeof data.fuso_horario !== "number" || Math.abs(data.fuso_horario) > 12) throw new TypeError("O fuso horário do ponto deve ser um número entre -12 e 12.");

        if(typeof data.data !== "string" || /^\d{4}-\d{2}-\d{2}$/.test(data.data)) throw new TypeError("A data do ponto deve estar no formato YYYY-MM-DD.");
        if(typeof data.hora_entrada !== "string" || /^\d{2}:\d{2}:\d{2}$/.test(data.hora_entrada)) throw new TypeError("A hora de entrada do ponto deve estar no formato HH:MM:SS.");
        if(typeof data.hora_saida !== "string" || /^\d{2}:\d{2}:\d{2}$/.test(data.hora_saida)) throw new TypeError("A hora de saída do ponto deve estar no formato HH:MM:SS.");
        if(typeof data.horas_trabalhadas !== "string" || /^\d{2}:\d{2}:\d{2}$/.test(data.horas_trabalhadas)) throw new TypeError("As horas trabalhadas devem estar no formato HH:MM:SS.");
        if(typeof data.horas_extras !== "string" || /^\d{2}:\d{2}:\d{2}$/.test(data.horas_extras)) throw new TypeError("As horas extras devem estar no formato HH:MM:SS.");

        this.data = data.data;
        this.funcionario = data.funcionario;
        this.fuso_horario = data.fuso_horario;
        this.hora_entrada = data.hora_entrada;
        this.hora_saida = data.hora_saida;
        this.horas_trabalhadas = data.horas_trabalhadas;
        this.horas_extras = data.horas_extras;

        return this;
    };
};