# 🎨 JFAgende - Sistema de Agendamento para Estética

Sistema completo de agendamento online para salões de beleza, barbearias, spas e clínicas de estética.

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ **Funcionalidades**

### 👥 **Para Clientes:**
- ✅ Cadastro e login seguro
- 📅 Agendamento online de serviços
- 🔍 Busca de estabelecimentos
- ⭐ Avaliação e comentários
- ❤️ Lista de favoritos
- 🔔 Notificações de agendamentos
- 📱 Acesso mobile responsivo

### 💼 **Para Estabelecimentos:**
- ✅ Painel administrativo completo
- 📊 Dashboard com estatísticas em tempo real
- 💰 Dashboard financeiro com dados reais
- 📅 Calendário interativo
- 🔒 Bloqueio de horários
- 📸 Portfólio de serviços
- 💳 Gestão de formas de pagamento
- 📈 Relatórios avançados
- 👥 Gestão de equipe
- 💎 Sistema de planos (FREE, BASIC, PREMIUM)

### 🔐 **Para Administradores:**
- 🎛️ Painel de controle total
- 👤 Gerenciamento de usuários
- 💎 Gerenciamento de planos
- 📊 Logs de auditoria
- 📈 Analytics e estatísticas globais

---

## 🚀 **Deploy Online (GRÁTIS)**

### **Opção 1: Deploy Automático (Recomendado)**

Execute o helper:
```bash
deploy-helper.bat
```

Ou siga: **[DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md)** (5 minutos!)

### **Opção 2: Deploy Manual**

Leia o guia completo: **[DEPLOY.md](DEPLOY.md)**

### **Plataformas Gratuitas:**
- 🚂 **Railway** - Backend + PostgreSQL (500h/mês grátis)
- ⚡ **Vercel** - Frontend (100GB bandwidth grátis)
- 🔄 **Deploy automático** via Git push!

---

## 💻 **Desenvolvimento Local**

### **Pré-requisitos:**
- Node.js 18+
- npm ou yarn
- Git

### **1. Clone o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/jfagende.git
cd jfagende
```

### **2. Configure o Backend:**
```bash
cd backend
npm install

# Copie e configure o .env
copy .env.example .env

# Configure a DATABASE_URL no .env:
DATABASE_URL="file:./dev.db"

# Rode as migrations
npx prisma migrate deploy

# Gere o Prisma Client
npx prisma generate

# Crie dados de teste (opcional)
npm run criar-dados-teste

# Crie um admin
npm run create-admin

# Inicie o servidor
npm start
```

### **3. Configure o Frontend:**
```bash
cd frontend
npm install

# Inicie o frontend
npm run dev
```

### **4. Acesse:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api

---

## 📱 **Acesso via Celular (Rede Local)**

O app funciona em qualquer dispositivo da mesma rede Wi-Fi!

1. Descubra seu IP local:
```bash
ipconfig | findstr "IPv4"
```

2. No celular, acesse:
```
http://192.168.1.X:3000
```

> O backend já está configurado para aceitar conexões externas! 🎉

---

## 🗄️ **Database**

### **Visualizar Database:**

Execute:
```bash
testar-database.bat
```

Ou manualmente:
```bash
cd backend
npx prisma studio
```

Acesse: http://localhost:5555

### **Migrations:**
```bash
# Criar nova migration
cd backend
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations (produção)
npx prisma migrate deploy

# Resetar database (CUIDADO!)
npx prisma migrate reset
```

---

## 🛠️ **Tecnologias**

### **Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL / SQLite
- JWT Authentication
- Bcrypt
- Multer (upload de imagens)
- Stripe (pagamentos)

### **Frontend:**
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide Icons
- date-fns
- React Big Calendar

---

## 📁 **Estrutura do Projeto**

```
jfagende/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── DEPLOY.md
├── DEPLOY-RAPIDO.md
└── README.md
```

---

## 🔐 **Credenciais Padrão**

### **Admin (Painel Administrativo):**
```
Email: jfadmin@jfagende.com
Senha: @Admin123
URL: http://localhost:3000/admin/login
```

> ⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

---

## 🔄 **Atualizações**

### **Fazer update do código:**

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

Railway e Vercel fazem deploy automático! 🚀

---

## 📊 **Sistema de Planos**

### **FREE:**
- ✅ Agendamentos ilimitados
- ✅ Calendário básico
- ❌ Portfólio limitado
- ❌ Relatórios

### **BASIC (R$ 29,90/mês):**
- ✅ Tudo do FREE
- ✅ Portfólio completo
- ✅ 5 dias de destaque/mês
- ✅ Relatórios básicos

### **PREMIUM (R$ 59,90/mês):**
- ✅ Tudo do BASIC
- ✅ Relatórios avançados
- ✅ 10 dias de destaque/mês
- ✅ Suporte prioritário
- ✅ Gestão de equipe

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit: `git commit -m 'Adiciona MinhaFeature'`
4. Push: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto está sob a licença MIT.

---

## 📧 **Contato**

Para dúvidas ou sugestões, abra uma issue no GitHub!

---

## 🎉 **Agradecimentos**

Desenvolvido com ❤️ para facilitar o agendamento em estabelecimentos de estética!

---

## 🔗 **Links Úteis**

- 📚 [Guia de Deploy Rápido](DEPLOY-RAPIDO.md)
- 📖 [Guia de Deploy Completo](DEPLOY.md)
- 🎨 [Prisma Docs](https://www.prisma.io/docs)
- ⚡ [Vite Docs](https://vitejs.dev)
- ⚛️ [React Docs](https://react.dev)

---

**🌟 Se este projeto te ajudou, deixe uma star no GitHub!**
