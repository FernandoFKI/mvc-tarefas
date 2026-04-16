# mvc-tarefas

Projeto Node.js com arquitetura MVC para gerenciamento de tarefas, desenvolvido com Express, EJS e MySQL.

## Tecnologias

- Node.js + Express
- EJS (template engine)
- MySQL2
- Express-Validator
- Moment.js
- dotenv

## Funcionalidades

- Listagem de tarefas ativas
- Cadastro de nova tarefa
- Edição de tarefa existente
- Exclusão lógica (inativa o registro — `status_tarefa = 0`)
- Exclusão física (remove permanentemente do banco)
- Validação de formulário com `express-validator`

## Rotas

| Método | Rota                  | Descrição                              |
|--------|-----------------------|----------------------------------------|
| GET    | `/`                   | Lista tarefas ativas                   |
| GET    | `/nova-tarefa`        | Formulário de cadastro                 |
| GET    | `/editar?id=N`        | Formulário de edição                   |
| POST   | `/nova-tarefa`        | Salva (cadastro ou alteração)          |
| GET    | `/excluir-logico?id=N`| Exclusão lógica (status_tarefa = 0)    |
| GET    | `/teste-delete`       | Teste: exclusão física do id=4         |
| GET    | `/teste-delete-logico`| Teste: exclusão lógica do id=3         |
| GET    | `/teste-create`       | Teste: insert direto                   |

## Configuração

1. Crie o banco de dados executando `config/script_bd.sql` no MySQL.
2. Copie `.env.example` para `.env` e ajuste as variáveis:

```
APP_PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=lista-tarefas
DB_PORT=3306
```

3. Instale as dependências e inicie:

```bash
npm install
node app.js
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Validações (express-validator)

- **Tarefa**: obrigatória, entre 5 e 45 caracteres.
- **Prazo**: obrigatório, data válida, deve ser hoje ou data futura.
- **Situação**: inteiro entre 0 e 4.

Erros são exibidos no próprio formulário sem perder os dados digitados.
