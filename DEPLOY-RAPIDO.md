# ⚡ Deploy Rápido - JFAgende

## 🎯 **3 Passos Simples para colocar Online (GRÁTIS)**

---

## **1️⃣ GITHUB (5 minutos)**

```bash
# No terminal (PowerShell)
cd C:\Users\Administrator\Desktop\JFAgende

# Inicializar Git
git init
git add .
git commit -m "JFAgende - Sistema de Agendamento"

# Criar repo no GitHub: https://github.com/new
# Depois rodar:
git remote add origin https://github.com/SEU_USUARIO/jfagende.git
git branch -M main
git push -u origin main
```

✅ **Pronto!** Código está no GitHub.

---

## **2️⃣ RAILWAY - Backend + Database (10 minutos)**

### **Passo a Passo:**

1. 🌐 Acesse: https://railway.app
2. 🔐 Faça login com GitHub
3. ➕ Clique em **"New Project"**
4. 📦 Escolha **"Deploy from GitHub repo"**
5. 📁 Selecione **jfagende**
6. ⚙️ Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

7. 🗄️ **Adicionar Database:**
   - Clique em **"+ New"**
   - Selecione **"Database" > "Add PostgreSQL"**
   - Pronto! DATABASE_URL é criada automaticamente

8. 🔧 **Adicionar Variáveis** (aba Variables):
```
NODE_ENV=production
JWT_SECRET=minhaChaveSecretaSuperSegura123!@#
FRONTEND_URL=https://seu-app.vercel.app
```

9. 🌐 **Gerar Domínio:**
   - Vá em Settings > Networking
   - Clique em **"Generate Domain"**
   - Copie a URL: `https://xxx.railway.app`

✅ **Backend Online!** 🎉

---

## **3️⃣ VERCEL - Frontend (5 minutos)**

### **Passo a Passo:**

1. 🌐 Acesse: https://vercel.com
2. 🔐 Faça login com GitHub
3. ➕ Clique em **"Add New Project"**
4. 📁 Selecione **jfagende**
5. ⚙️ Configure:
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. 🔧 **Variável de Ambiente:**
```
VITE_API_URL = https://xxx.railway.app/api
```
   > Use a URL do Railway do passo 2!

7. 🚀 Clique em **Deploy**

8. 🔄 **Volte no Railway e atualize:**
```
FRONTEND_URL=https://seu-app.vercel.app
```

✅ **Tudo Online!** 🚀🎉

---

## **🔄 PARA ATUALIZAR (sempre que fizer mudanças)**

```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

**E pronto!** Railway e Vercel fazem deploy automático! ⚡

---

## **📋 CHECKLIST FINAL**

Depois que estiver tudo online:

### **Backend (Railway):**
- [ ] Serviço está "Running" (verde)
- [ ] Domínio foi gerado
- [ ] Database PostgreSQL está conectada
- [ ] Variáveis de ambiente configuradas
- [ ] Acesse `https://xxx.railway.app` - deve mostrar JSON da API

### **Frontend (Vercel):**
- [ ] Deploy está "Ready" (verde)  
- [ ] VITE_API_URL aponta para Railway
- [ ] Acesse o site - deve carregar normalmente
- [ ] Teste login/registro

### **Migrations:**

Primeira vez, rode no Railway CLI:
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Rodar migrations
railway run npm run prisma:deploy

# Criar admin
railway run npm run create-admin
```

---

## **💰 CUSTOS**

### **TOTALMENTE GRÁTIS! 🎉**

- ✅ Railway: 500h/mês + PostgreSQL
- ✅ Vercel: 100GB bandwidth + deploys ilimitados
- ✅ GitHub: Repos ilimitados (privados ou públicos)

---

## **🆘 PROBLEMAS?**

### **Backend não inicia?**
```bash
railway logs
```

Verifique:
- DATABASE_URL existe?
- JWT_SECRET definido?
- Migrations foram rodadas?

### **Frontend não conecta?**
- Abra DevTools (F12)
- Veja a URL que está sendo chamada
- Confirme que VITE_API_URL está correta

### **Database vazia?**
```bash
railway run npm run criar-dados-teste
```

---

## **🎁 BÔNUS: Domínio Personalizado**

Quer `meuapp.com` ao invés de `xxx.vercel.app`?

1. Compre domínio (~R$40/ano): Registro.br, GoDaddy, Namecheap
2. No Vercel: Settings > Domains > Add
3. Configure DNS conforme instruções
4. Aguarde 24-48h

---

**Seu app está ONLINE! 🌍**

Compartilhe com o mundo! 🚀

