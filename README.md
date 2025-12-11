# Projeto_Final

### Ponto Certo

Ponto Certo será uma aplicação web simples para registro de ponto de funcionários.
O sistema permite que funcionários façam login e registrem batidas de entrada e
saída no trabalho. No backend, cada batida é gravada associada ao funcionário; no
frontend há telas para login, cadastro de funcionário e visualização/cálculo das
horas registradas. O objetivo principal é registrar a batida de ponto do usuário,
usando duas tabelas no banco: funcionarios e pontos. 

### Modelagem e esquema do banco:

_---------------------------_

funcionario:

id — identificador único (PK)

nome — nome do funcionário

senha — senha em texto

_---------------------------_

ponto:

horas_trabalhadas — diferença entre hora_entrada e hora_saída (em horas) (gerada automaticamente)

horas_extras — horas acima de 8 (caso haja) (gerada automaticamente)

### Endpoints

- Página criar.html:

| Método HTTP | URL          | O que faz                | Tabelas     |
| ----------- | ------------ | ------------------------ | ----------- |
| POST        | /funcionario | Cria um novo funcionário | funcionario |

- Página entrar.html

| Método HTTP | URL              | O que faz            | Tabelas     |
| ----------- | ---------------- | -------------------- | ----------- |
| GET         | /funcionario/:id | Busca um funcionário | funcionario |

- Página calcular.html

| Método HTTP | URL          | O que faz                                                              | Tabelas |
| ----------- | ------------ | ---------------------------------------------------------------------- | ------- |
| GET         | /ponto/:data | Busca o ponto em andamento do funcionário, caso haja um                | ponto   |
| POST        | /ponto       | Cadastra um novo ponto                                                 | ponto   |
| PUT         | /ponto/:data | Atualiza o ponto cadastrado no dia, caso um tenha sido cadastrado      | ponto   |


