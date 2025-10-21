# 🚀 Guia de Deploy - JFAgende

Este guia mostra como colocar seu app **gratuitamente na internet** e facilitar atualizações futuras.

## 📋 **Pré-requisitos**

1. Conta no GitHub (gratuita)
2. Conta no Railway (gratuita) - https://railway.app
3. Conta no Vercel (gratuita) - https://vercel.com

---

## 🎯 **PARTE 1: Preparar o Repositório Git**

### **1.1. Inicializar Git (se ainda não fez)**

```bash
cd C:\Users\Administrator\Desktop\JFAgende
git init
git add .
git commit -m "Initial commit - JFAgende App"
```

### **1.2. Criar Repositório no GitHub**

1. Acesse https://github.com/new
2. Nome do repositório: `jfagende`
3. Deixe como **Privado** (ou Público, você escolhe)
4. **NÃO** marque "Initialize with README"
5. Clique em **Create repository**

### **1.3. Conectar ao GitHub**

```bash
git remote add origin https://github.com/SEU_USUARIO/jfagende.git
git branch -M main
git push -u origin main
```

---

## 🚂 **PARTE 2: Deploy do Backend (Railway)**

### **2.1. Criar Projeto no Railway**

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Escolha **"Deploy from GitHub repo"**
5. Selecione o repositório `jfagende`
6. Aguarde o deploy inicial (vai falhar, é normal!)

### **2.2. Adicionar Database PostgreSQL**

1. No seu projeto Railway, clique em **"+ New"**
2. Selecione **"Database"** > **"Add PostgreSQL"**
3. Railway vai criar automaticamente o banco
4. Anote a variável `DATABASE_URL` (vai aparecer nas variáveis)

### **2.3. Configurar Variáveis de Ambiente**

No Railway, vá em **Variables** e adicione:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=(já está configurada automaticamente)
JWT_SECRET=minhaChaveSecretaSuperSegura123!@#
FRONTEND_URL=https://seu-app.vercel.app
```

> **IMPORTANTE:** Depois você vai atualizar `FRONTEND_URL` com a URL real do Vercel.

### **2.4. Configurar o Build**

1. Vá em **Settings** do serviço
2. Em **Build & Deploy**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Em **Networking**:
   - Clique em **Generate Domain**
   - Anote a URL: `https://seu-backend-xxxxx.up.railway.app`

### **2.5. Deploy Manual**

```bash
# No seu computador
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

O Railway detectará o push e fará o deploy automaticamente! 🎉

---

## ⚡ **PARTE 3: Deploy do Frontend (Vercel)**

### **3.1. Criar Projeto no Vercel**

1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New..."** > **"Project"**
4. Selecione o repositório `jfagende`
5. Configure:

   **Framework Preset:** Vite
   
   **Root Directory:** `frontend`
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `dist`

### **3.2. Adicionar Variável de Ambiente**

Em **Environment Variables**, adicione:

```
VITE_API_URL = https://seu-backend-xxxxx.up.railway.app/api
```

> Use a URL do Railway que você anotou!

### **3.3. Deploy**

Clique em **Deploy** e aguarde!

O Vercel vai te dar uma URL tipo: `https://jfagende.vercel.app`

### **3.4. Atualizar CORS no Backend**

Volte no Railway e atualize a variável:

```env
FRONTEND_URL=https://jfagende.vercel.app
```

---

## 🔄 **ATUALIZAÇÕES FUTURAS**

### **É SUPER SIMPLES! Apenas 3 comandos:**

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

**E pronto!** 🎉

- Railway e Vercel detectam automaticamente
- Fazem o build
- Fazem o deploy
- Tudo em ~2 minutos!

---

## 📊 **PARTE 4: Configurar Database de Produção**

### **4.1. Migrar o Schema**

Depois do primeiro deploy, você precisa rodar as migrations:

1. No Railway, vá no seu serviço de backend
2. Clique em **Settings** > **Data**
3. Ou use o Railway CLI:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar ao projeto
railway link

# Rodar migrations
railway run npm run prisma:deploy
```

### **4.2. Criar Usuário Admin**

```bash
railway run npm run create-admin
```

Ou crie manualmente via Prisma Studio:
1. No Railway, clique em PostgreSQL
2. Clique em **"Connect"**
3. Use o DATABASE_URL para conectar no Prisma Studio local

---

## 🎁 **RECURSOS GRATUITOS**

### **Railway (Backend + Database)**
- ✅ 500 horas de execução/mês
- ✅ 1GB RAM
- ✅ PostgreSQL incluso
- ✅ Deploy automático via Git

### **Vercel (Frontend)**
- ✅ 100GB Bandwidth/mês
- ✅ Deploy ilimitados
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy preview em cada PR

---

## 🆘 **TROUBLESHOOTING**

### **Backend não inicia no Railway?**
```bash
# Ver logs em tempo real
railway logs
```

Verifique se:
- DATABASE_URL está configurada
- JWT_SECRET está definido
- Migrations foram executadas

### **Frontend não conecta no Backend?**
- Verifique se VITE_API_URL está correta
- Verifique CORS no backend (FRONTEND_URL)
- Veja logs no console do navegador

### **Database vazia?**
```bash
# Criar dados de teste
railway run npm run criar-dados-teste
```

---

## 🌟 **ALTERNATIVAS**

### **Outras opções gratuitas:**

1. **Render.com** (Backend + Frontend + DB)
   - Boa alternativa ao Railway
   - 750 horas/mês grátis

2. **Fly.io** (Backend + DB)
   - Mais complexo, mas muito poderoso
   - 3 VMs grátis

3. **Netlify** (Frontend)
   - Alternativa ao Vercel
   - Mesmas features

---

## ✨ **PRÓXIMOS PASSOS**

Depois que estiver online:

1. **Domínio Personalizado** (opcional)
   - Compre um domínio (~R$40/ano)
   - Configure no Vercel e Railway

2. **Monitoramento**
   - Railway e Vercel já incluem analytics básicos
   - Use Sentry.io para rastrear erros (grátis)

3. **Backup**
   - Railway faz backup automático do PostgreSQL
   - Configure backups manuais também

---

## 📞 **SUPORTE**

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Boa sorte! 🚀**

Seu app vai estar online e acessível de qualquer lugar do mundo!

