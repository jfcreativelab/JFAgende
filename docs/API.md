# Documentação da API - JFAgende

API RESTful para o sistema de agendamento JFAgende.

## 🔗 Base URL

```
http://localhost:5000/api
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 📚 Endpoints

### Autenticação

#### Registrar Cliente
```http
POST /auth/register/cliente
```

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 98888-8888",
  "senha": "senha123",
  "fotoPerfil": "url_da_foto (opcional)"
}
```

**Resposta (201):**
```json
{
  "message": "Cliente registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 98888-8888",
    "fotoPerfil": null,
    "criadoEm": "2025-01-15T10:00:00.000Z"
  }
}
```

---

#### Registrar Estabelecimento
```http
POST /auth/register/estabelecimento
```

**Body:**
```json
{
  "nome": "Salão Beleza Total",
  "email": "contato@salao.com",
  "telefone": "(11) 3333-4444",
  "senha": "senha123",
  "categoria": "salao",
  "descricao": "Salão de beleza completo",
  "endereco": "Rua Exemplo, 123 - São Paulo/SP",
  "imagemCapa": "url_da_imagem (opcional)"
}
```

**Resposta (201):**
```json
{
  "message": "Estabelecimento registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Salão Beleza Total",
    "email": "contato@salao.com",
    "categoria": "salao",
    "endereco": "Rua Exemplo, 123 - São Paulo/SP"
  }
}
```

---

#### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "senha": "senha123",
  "tipo": "cliente" // ou "estabelecimento"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... },
  "tipo": "cliente"
}
```

---

### Clientes

#### Obter Dados do Cliente
```http
GET /clientes/:id
```
**Autenticação:** Requerida (Cliente)

**Resposta (200):**
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 98888-8888",
  "fotoPerfil": null,
  "criadoEm": "2025-01-15T10:00:00.000Z"
}
```

---

#### Atualizar Cliente
```http
PUT /clientes/:id
```
**Autenticação:** Requerida (Cliente)

**Body:**
```json
{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 99999-9999",
  "fotoPerfil": "nova_url"
}
```

---

#### Listar Agendamentos do Cliente
```http
GET /clientes/:id/agendamentos
```
**Autenticação:** Requerida (Cliente)

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "dataHora": "2025-01-20T14:00:00.000Z",
    "status": "CONFIRMADO",
    "estabelecimento": {
      "nome": "Salão Beleza Total",
      "endereco": "Rua Exemplo, 123"
    },
    "servico": {
      "nome": "Corte de Cabelo",
      "duracaoMin": 30,
      "preco": 50.00
    }
  }
]
```

---

### Estabelecimentos

#### Listar Estabelecimentos
```http
GET /estabelecimentos
```
**Autenticação:** Não requerida

**Query Parameters:**
- `categoria` (opcional): Filtrar por categoria
- `cidade` (opcional): Filtrar por cidade
- `nome` (opcional): Buscar por nome

**Exemplo:**
```
GET /estabelecimentos?categoria=salao&cidade=São Paulo
```

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "nome": "Salão Beleza Total",
    "categoria": "salao",
    "descricao": "Salão de beleza completo",
    "endereco": "Rua Exemplo, 123 - São Paulo/SP",
    "telefone": "(11) 3333-4444",
    "imagemCapa": null,
    "criadoEm": "2025-01-10T10:00:00.000Z"
  }
]
```

---

#### Obter Detalhes do Estabelecimento
```http
GET /estabelecimentos/:id
```
**Autenticação:** Não requerida

**Resposta (200):**
```json
{
  "id": "uuid",
  "nome": "Salão Beleza Total",
  "categoria": "salao",
  "descricao": "Salão de beleza completo",
  "endereco": "Rua Exemplo, 123 - São Paulo/SP",
  "telefone": "(11) 3333-4444",
  "email": "contato@salao.com",
  "imagemCapa": null,
  "servicos": [
    {
      "id": "uuid",
      "nome": "Corte de Cabelo",
      "duracaoMin": 30,
      "preco": 50.00,
      "descricao": "Corte masculino ou feminino"
    }
  ],
  "horarios": [
    {
      "id": "uuid",
      "diaSemana": 1,
      "horaInicio": "09:00",
      "horaFim": "18:00"
    }
  ]
}
```

---

#### Atualizar Estabelecimento
```http
PUT /estabelecimentos/:id
```
**Autenticação:** Requerida (Estabelecimento)

**Body:**
```json
{
  "nome": "Novo Nome",
  "descricao": "Nova descrição",
  "endereco": "Novo endereço",
  "telefone": "Novo telefone"
}
```

---

#### Criar Serviço
```http
POST /estabelecimentos/:id/servicos
```
**Autenticação:** Requerida (Estabelecimento)

**Body:**
```json
{
  "nome": "Corte de Cabelo",
  "duracaoMin": 30,
  "preco": 50.00,
  "descricao": "Corte masculino ou feminino (opcional)"
}
```

**Resposta (201):**
```json
{
  "message": "Serviço criado com sucesso",
  "servico": {
    "id": "uuid",
    "nome": "Corte de Cabelo",
    "duracaoMin": 30,
    "preco": 50.00,
    "ativo": true
  }
}
```

---

#### Listar Serviços
```http
GET /estabelecimentos/:id/servicos
```
**Autenticação:** Não requerida

---

#### Atualizar Serviço
```http
PUT /estabelecimentos/:id/servicos/:servicoId
```
**Autenticação:** Requerida (Estabelecimento)

**Body:**
```json
{
  "nome": "Corte Premium",
  "preco": 80.00,
  "ativo": true
}
```

---

#### Deletar (Desativar) Serviço
```http
DELETE /estabelecimentos/:id/servicos/:servicoId
```
**Autenticação:** Requerida (Estabelecimento)

---

#### Criar Horário de Funcionamento
```http
POST /estabelecimentos/:id/horarios
```
**Autenticação:** Requerida (Estabelecimento)

**Body:**
```json
{
  "diaSemana": 1,
  "horaInicio": "09:00",
  "horaFim": "18:00"
}
```

**Dias da Semana:**
- 0 = Domingo
- 1 = Segunda-feira
- 2 = Terça-feira
- 3 = Quarta-feira
- 4 = Quinta-feira
- 5 = Sexta-feira
- 6 = Sábado

---

### Agendamentos

#### Criar Agendamento
```http
POST /agendamentos
```
**Autenticação:** Requerida (Cliente)

**Body:**
```json
{
  "estabelecimentoId": "uuid",
  "servicoId": "uuid",
  "dataHora": "2025-01-20T14:00:00.000Z",
  "observacoes": "Preferência por profissional específico (opcional)"
}
```

**Resposta (201):**
```json
{
  "message": "Agendamento criado com sucesso",
  "agendamento": {
    "id": "uuid",
    "dataHora": "2025-01-20T14:00:00.000Z",
    "status": "PENDENTE",
    "cliente": {
      "nome": "João Silva",
      "telefone": "(11) 98888-8888"
    },
    "estabelecimento": {
      "nome": "Salão Beleza Total"
    },
    "servico": {
      "nome": "Corte de Cabelo",
      "preco": 50.00
    }
  }
}
```

---

#### Listar Agendamentos do Estabelecimento
```http
GET /agendamentos/estabelecimento/:id
```
**Autenticação:** Requerida (Estabelecimento)

**Query Parameters:**
- `status` (opcional): Filtrar por status (PENDENTE, CONFIRMADO, CANCELADO, CONCLUIDO)
- `data` (opcional): Filtrar por data (formato: YYYY-MM-DD)

**Exemplo:**
```
GET /agendamentos/estabelecimento/uuid?status=PENDENTE&data=2025-01-20
```

---

#### Buscar Horários Disponíveis
```http
GET /agendamentos/horarios-disponiveis
```
**Autenticação:** Requerida (Cliente)

**Query Parameters:**
- `estabelecimentoId`: ID do estabelecimento
- `servicoId`: ID do serviço
- `data`: Data desejada (formato: YYYY-MM-DD)

**Exemplo:**
```
GET /agendamentos/horarios-disponiveis?estabelecimentoId=uuid&servicoId=uuid&data=2025-01-20
```

**Resposta (200):**
```json
{
  "horarioFuncionamento": {
    "horaInicio": "09:00",
    "horaFim": "18:00"
  },
  "duracaoServico": 30,
  "horariosOcupados": [
    "2025-01-20T10:00:00.000Z",
    "2025-01-20T14:00:00.000Z"
  ]
}
```

---

#### Atualizar Status do Agendamento
```http
PUT /agendamentos/:id
```
**Autenticação:** Requerida (Cliente ou Estabelecimento)

**Body:**
```json
{
  "status": "CONFIRMADO"
}
```

**Status disponíveis:**
- `PENDENTE`
- `CONFIRMADO`
- `CANCELADO`
- `CONCLUIDO`

---

#### Cancelar Agendamento
```http
DELETE /agendamentos/:id
```
**Autenticação:** Requerida (Cliente ou Estabelecimento)

**Resposta (200):**
```json
{
  "message": "Agendamento cancelado com sucesso"
}
```

---

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou não fornecido |
| 403 | Forbidden - Sem permissão para acessar |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

**Formato de Erro:**
```json
{
  "error": "Mensagem de erro descritiva"
}
```

---

## 📝 Notas

1. Todas as datas devem estar no formato ISO 8601 (ex: `2025-01-20T14:00:00.000Z`)
2. Os preços devem ser números com até 2 casas decimais
3. As durações são sempre em minutos (inteiro)
4. O token JWT expira em 7 dias por padrão

---

## 🔧 Desenvolvimento

Para testar a API localmente:

1. Configure o banco de dados no `.env`
2. Execute as migrations: `npm run prisma:migrate`
3. Inicie o servidor: `npm run dev`
4. A API estará disponível em `http://localhost:5000`

Use ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar os endpoints.

