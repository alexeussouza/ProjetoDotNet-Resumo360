# 💰 Gestão Financeira

Interface web para gerenciar despesas, receitas e compras com cartão, com autenticação via JWT e relatórios gráficos interativos.

---

## ⚙️ Tecnologias

- React + TypeScript
- React Router DOM
- Axios (requisições HTTP)
- Chart.js (gráficos interativos)
- Autenticação JWT com localStorage
- CSS modular e layout autenticado

---

## 🛠️ Pré-requisitos

- Node.js e npm instalados
- Projeto de backend rodando com a API (futuramente em ASP.NET Core + PostgreSQL)
- Token JWT armazenado via login

---

## ▶️ Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/SENAI-SD/prova-csharp-junior-01450-2025-722.643.141-68.git
cd despesas-app

```

2. Crie o arquivo de variáveis de ambiente .env com as seguintes chaves na raiz do projeto:

```
JwtSettings=Lx2Wj87YpZVqFutN1MBP9kEhOsTd6rQvAnGmU4XeCshbRYlpQH

```
3. Subir os containers

```
docker-compose up -d --build

```
Isso inicializa:

> PostgreSQL

> API backend na porta 8080

> Frontend React via NGINX (acessível em http://localhost)

> NGINX roteando tudo com proxy


4. Configurar o banco:

> A view resumo_financeiro_mensal deve ser criada no banco db_despesas (ver instrução acima).

> Os dados de conexão estão definidos no docker-compose.yml e appsettings.json.

5. 📊 Criação da View de Resumo Financeiro Mensal

Após subir o container do postgres crie a view abaixo no seu banco PostgreSQL. Ela consolida receitas, despesas e saldo mês a mês, servindo de base para os relatórios e o dashboard:

```
CREATE OR REPLACE VIEW resumo_financeiro_mensal AS
WITH receitas_mensais AS (
  SELECT
    date_trunc('month', "DataRecebimento") AS mes,
    SUM("Valor") AS total_receitas
  FROM "Receitas"
  GROUP BY mes
),
despesas_mensais AS (
  SELECT
    date_trunc('month', "DataVencimento") AS mes,
    SUM("Valor") AS total_despesas
  FROM "Despesas"
  GROUP BY mes
)
SELECT
  r.mes,
  COALESCE(r.total_receitas, 0) AS total_receitas,
  COALESCE(d.total_despesas, 0) AS total_despesas,
  COALESCE(r.total_receitas, 0) - COALESCE(d.total_despesas, 0) AS saldo
FROM receitas_mensais r
LEFT JOIN despesas_mensais d ON r.mes = d.mes
ORDER BY r.mes DESC;

```

6. Inicie a aplicação

```
http://localhost

```
7. Usuário administrativo padrão para acesso ao sistema

| Email                |   Senha  |
|:---------------------|:---------|
| `admin@email.com`    | `123456` |


## 🧭 Estrutura de Rotas

| Caminho        | Página             | Protegida? |
|----------------|--------------------|------------|
| `/login`       | Tela de Login      | ❌ Não     |
| `/`            | Dashboard          | ✅ Sim     |
| `/despesas`    | Contas a Pagar     | ✅ Sim     |
| `/receitas`    | Contas a Receber   | ✅ Sim     |
| `/cartoes`     | Compras no Cartão  | ✅ Sim     |
| `/relatorios`  | Relatórios         | ✅ Sim     |

As rotas protegidas exigem um token JWT salvo no localStorage.

## 📈 Gráficos
GraficoPizza: Despesas e receitas por categoria

GraficoLinha: Evolução do saldo mensal

## 📌 Observações

O backend será conectado a um banco PostgreSQL: db_despesas

## 🔒 Login JWT
Após autenticar, o token é armazenado em localStorage e usado para liberar o acesso às demais rotas.

## 🧠 API Principal – Endpoints Autenticados

| Método  |        Rota                |              Descrição                |
|:--------|:----------------------------|:-------------------------------------|
| POST    | `/auth/login`               | Geração de token JWT                 |
| POST    | `/usuarios/cadastrar`       | Cadastro de novos usuários           |
| GET     | `/receitas`                 | Lista receitas do usuário            |
| POST    | `/receitas`                 | Cadastra nova receita                |
| PUT     | `/receitas/{id}`            | Edita uma receita                    |
| DELETE  | `/receitas/{id}`            | Remove uma receita                   |
| GET     | `/despesas`                 | Lista despesas do usuário            |
| POST    | `/despesas`                 | Cadastra nova despesa                |
| PUT     | `/despesas/{id}`            | Edita uma despesa                    |
| DELETE  | `/despesas/{id}`            | Remove uma despesa                   |
| GET     | `/relatorios/mensal`        | Relatório consolidado por mês        |
|:--------|:---------------------------|:--------------------------------------|

## 📊 API do Dashboard – Indicadores Rápidos

| Método  |                Rota                 |               Retorna                      |
|:--------|:------------------------------------|:-------------------------------------------|
| GET     | `/dashboard/receitas-do-mes`        | Total de receitas do mês atual             |
| GET     | `/dashboard/despesas-do-mes`        | Total de despesas do mês atual             |
| GET     | `/dashboard/saldo-do-mes`           | Diferença entre receitas e despesas do mês |
| GET     | `/dashboard/contas-vencidas`        | Quantidade de contas vencidas (pendentes)  |
| GET     | `/dashboard/contas-a-vencer`        | Contas vencendo nos próximos 5 dias        |

> Todos os endpoints do dashboard requerem autenticação via JWT no header Authorization.

## ⚙️ Serviços do Docker

| Serviço          | Imagem Base                            | Função                           |  Porta Host  |
|:-----------------|:---------------------------------------|:---------------------------------|:-------------|
| `api_despesas`   | `mcr.microsoft.com/dotnet/aspnet:7.0`  | API REST ASP.NET Core            | 5000         |
| `db_despesas`    | `postgres:15-alpine`                   | Banco de dados PostgreSQL        | 5432         |
| `frontend`       | `node:18-alpine` (build)               | React + Vite                     | 3000         |
| `nginx`          | `nginx:stable`                         | Reverse proxy para API e React   | 80           |


## ✅ Requisitos

> Docker e Docker Compose

> Node.js (apenas se for executar o frontend fora do container)

> .NET 7 SDK (apenas se for executar a API fora do container)

## 🛠️ Melhorias futuras sugeridas

> Endpoint /dashboard/resumo único

> Paginação e filtros nas listagens

> Histórico de login e atividades

## Autor

> Alexandre de Souza Eustaquio

![image](https://github.com/user-attachments/assets/cce0e8ab-77a9-4dda-bf29-2779435f193b)


![image](https://github.com/user-attachments/assets/fdb1bbbf-e2cc-4917-9725-b571029018f4)

![image](https://github.com/user-attachments/assets/0c976203-66cd-4fab-8000-74b25853884e)

![image](https://github.com/user-attachments/assets/f6c100ee-0e7e-43a8-bc2c-5e584bee704e)

![image](https://github.com/user-attachments/assets/7bbf5138-107d-4cfc-b2f5-ddea936fd8f6)

![image](https://github.com/user-attachments/assets/6e179773-fec2-424e-8ed9-fe4fc5acb160)






