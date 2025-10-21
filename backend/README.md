# JFAgende - Backend

API RESTful para o sistema de agendamento JFAgende.

## 🚀 Tecnologias

- Node.js + Express
- Prisma ORM
- PostgreSQL / SQLite
- JWT para autenticação
- bcrypt para hash de senhas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Iniciar servidor em modo desenvolvimento
npm run dev
```

## 🗄️ Banco de Dados

Por padrão, o projeto usa SQLite para desenvolvimento. Para usar PostgreSQL:

1. Edite `prisma/schema.prisma` e altere o provider para "postgresql"
2. Atualize a `DATABASE_URL` no arquivo `.env`
3. Execute `npm run prisma:migrate`

## 📚 Documentação da API

Veja o arquivo `/docs/API.md` para documentação completa dos endpoints.

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com watch
- `npm start` - Inicia o servidor em modo produção
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa migrations do banco
- `npm run prisma:studio` - Abre o Prisma Studio (interface visual do banco)

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── src/
│   ├── controllers/         # Lógica de negócio
│   ├── routes/              # Definição de rotas
│   ├── middleware/          # Middlewares (auth, etc)
│   ├── utils/               # Utilitários (jwt, password)
│   └── server.js            # Configuração do servidor
└── package.json
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

## 🌐 Ambientes

- **Development**: SQLite, logs detalhados
- **Production**: PostgreSQL recomendado, sem logs sensíveis

