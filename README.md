# 🚗 Brand-Motors

**Sistema web completo de gestão para concessionária de veículos** — vitrine online para o cliente e painel administrativo para a equipe, em uma única aplicação fullstack.

> Trabalho de Conclusão de Curso — Análise e Desenvolvimento de Sistemas, FATEC Bragança Paulista.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

---

## 📌 Sobre o projeto

Concessionárias lidam ao mesmo tempo com dois públicos: o **cliente**, que quer navegar pelo estoque, negociar e agendar serviços; e a **equipe interna**, que precisa controlar veículos, vendas, comissões e atendimentos.

O Brand-Motors resolve os dois lados na mesma plataforma — uma vitrine pública com fluxo de compra completo e um painel administrativo com controle de acesso por cargo.

---

## ✨ Funcionalidades

### 🛒 Área do cliente

| Funcionalidade | Descrição |
| --- | --- |
| **Vitrine de veículos** | Listagem do estoque com filtros e página de anúncio individual |
| **Carrinho de compras** | Seleção de veículos e confirmação de compra com modal de checkout |
| **Favoritos** | Salvar veículos de interesse para consultar depois |
| **Vender meu carro** | Formulário para o cliente cadastrar um veículo à venda |
| **Agendamento de serviços** | Marcar revisão, manutenção, test drive e outros serviços |
| **Conversas** | Canal de contato direto com um funcionário da concessionária |
| **Perfil e histórico** | Edição de dados, "meus veículos" e histórico de compras |

### 🔐 Painel administrativo

| Funcionalidade | Descrição |
| --- | --- |
| **Gestão de estoque** | CRUD de veículos com upload de imagens |
| **Gestão de clientes** | Listagem e consulta detalhada de cada cliente |
| **Gestão de funcionários** | CRUD de funcionários com atribuição de cargo |
| **Painel de vendas** | Acompanhamento de vendas realizadas |
| **Comissões** | Cálculo de comissão por venda |
| **Central de conversas** | Atendimento das mensagens recebidas dos clientes |
| **Relatórios em PDF** | Exportação de relatórios gerados com jsPDF |

---

## 🛠️ Tecnologias

**Backend**

- Node.js + Express — API REST
- Sequelize (ORM) + MySQL
- JWT (`jsonwebtoken`) para autenticação
- bcrypt para hash de senhas
- Multer para upload de imagens
- Nodemailer para envio automatizado de e-mails
- dotenv para variáveis de ambiente

**Frontend**

- React 18 (Create React App)
- React Router DOM 6 — navegação SPA
- Axios — consumo da API
- jsPDF + jspdf-autotable — geração de relatórios
- React Icons

---

## 🏗️ Arquitetura

```
Brand-Motors/
├── backend/
│   ├── config/
│   │   └── database.js         # conexão Sequelize/MySQL
│   ├── models/                 # entidades e relacionamentos
│   │   ├── Cliente.js  Carro.js  Funcionario.js
│   │   ├── Servico.js  Carrinho.js  Agendamento.js
│   │   ├── Conversa.js  Processo.js  Possui.js
│   │   └── index.js            # associações + sync
│   ├── middleware/
│   │   ├── auth.js             # valida o token JWT
│   │   ├── permissao.js        # autorização por cargo
│   │   └── multerCarros.js     # upload de imagens
│   ├── rotas/                  # endpoints da API REST
│   ├── services/
│   │   └── emailService.js     # envio de e-mails
│   └── index.js                # entrada do servidor (porta 3001)
│
└── frontend/
    └── src/
        ├── pages/              # telas da vitrine
        │   └── painel/         # telas do administrativo
        ├── components/         # componentes reutilizáveis
        ├── styles/             # CSS por componente/página
        └── App.js              # rotas do React Router
```

### Modelagem de dados

O domínio é modelado em 9 entidades com relacionamentos via Sequelize:

- `Cliente` ⟷ `Carro` — N:N através de **Possui** (veículos que o cliente já possui)
- `Servico` ⟷ `Funcionario` — N:N através de **Agendamento**
- `Servico` ⟷ `Carro` — N:N através de **Processo**
- `Cliente` → `Conversa` ← `Funcionario` — 1:N em ambos os lados
- `Carro` → `Carrinho` — 1:N

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [MySQL](https://www.mysql.com/) 8 ou superior

### 1. Clone o repositório

```bash
git clone https://github.com/RaulJBrandao/Brand-Motors.git
cd Brand-Motors
```

### 2. Crie o banco de dados

```sql
CREATE DATABASE brandmotors;
```

> As tabelas são criadas automaticamente pelo Sequelize (`sequelize.sync()`) na primeira execução do servidor.

### 3. Configure o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
DB_HOST=localhost
DB_NAME=brandmotors
DB_USER=root
DB_PASSWORD=sua_senha
JWT_SECRET=uma_chave_secreta_qualquer
```

Inicie o servidor:

```bash
node index.js
```

> API disponível em `http://localhost:3001`

### 4. Configure o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

> Aplicação disponível em `http://localhost:3000`
> O `proxy` já está configurado no `package.json` para encaminhar as requisições ao backend.

---

## 🔌 Endpoints da API

| Método | Rota base | Recurso |
| --- | --- | --- |
| `GET/POST/PUT/DELETE` | `/clientes` | Clientes e autenticação |
| `GET/POST/PUT/DELETE` | `/carros` | Estoque de veículos |
| `GET/POST/PUT/DELETE` | `/funcionarios` | Funcionários |
| `GET/POST` | `/servicos` | Serviços oferecidos |
| `GET/POST/DELETE` | `/carrinhos` | Carrinho de compras |
| `GET/POST` | `/agendamentos` | Agendamento de serviços |
| `GET/POST` | `/conversas` | Mensagens cliente ⟷ funcionário |
| `GET/POST` | `/compras` | Efetivação de compras |
| `GET` | `/history` | Histórico de compras |
| `GET/POST` | `/possui` | Veículos do cliente |
| `GET/POST` | `/processos` | Serviços em andamento |
| `GET` | `/relatorios` | Dados para relatórios |
| `GET` | `/comissao` | Cálculo de comissões |
| `GET` | `/financiamento` | Simulação de financiamento |
| `POST` | `/vender` | Cadastro de veículo pelo cliente |

---

## 🔒 Autenticação e permissões

A API usa **JWT via header Authorization**:

```
Authorization: Bearer <token>
```

O middleware `auth.js` valida o token e injeta `req.usuario = { id, cargo }` na requisição. Em cima disso, o middleware `permissao.js` restringe rotas por cargo:

```js
// só administradores e gerentes acessam esta rota
router.delete('/:id', auth, permissao('admin', 'gerente'), controller.remover);
```

Senhas nunca são armazenadas em texto puro — todas passam por hash com **bcrypt** antes de ir para o banco.

---

## 🗺️ Próximos passos

- [ ] Testes automatizados (unitários e de integração) com Jest
- [ ] Migrations do Sequelize no lugar do `sync()`
- [ ] Paginação e busca no endpoint de veículos
- [ ] Deploy (backend + banco gerenciado + frontend estático)
- [ ] Containerização com Docker

---

## 👤 Autor

**Raul Brandão** — Desenvolvedor Jr.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rauljb/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/RaulJBrandao)
