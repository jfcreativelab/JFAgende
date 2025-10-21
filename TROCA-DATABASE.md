# 🔄 Trocar entre SQLite e PostgreSQL

## 📦 **Desenvolvimento Local (SQLite)**

### **Configuração Atual:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### **.env:**
```
DATABASE_URL="file:./dev.db"
```

✅ **Mais rápido para desenvolvimento**  
✅ **Não precisa instalar nada**  
✅ **Arquivo local simples**

---

## 🚀 **Produção (PostgreSQL)**

### **Quando fazer deploy no Railway:**

**1. Edite `backend/prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // ← Mude aqui
  url      = env("DATABASE_URL")
}
```

**2. No Railway, a variável DATABASE_URL já é configurada automaticamente!**

**3. Rode as migrations:**
```bash
railway run npm run prisma:deploy
```

✅ **Mais robusto**  
✅ **Melhor performance**  
✅ **Pronto para escala**

---

## ⚠️ **IMPORTANTE**

Quando trocar de SQLite para PostgreSQL:
1. Mude o `provider` no schema.prisma
2. Configure DATABASE_URL com PostgreSQL
3. Rode: `npx prisma migrate deploy`
4. Recrie os dados (ou migre se necessário)

---

## 💡 **Dica**

No Railway, após o primeiro deploy:
1. Entre no terminal do Railway
2. Rode: `npm run create-admin`
3. Rode: `npm run criar-dados-teste` (opcional)

Ou use Railway CLI localmente:
```bash
railway run npm run create-admin
railway run npm run criar-dados-teste
```

