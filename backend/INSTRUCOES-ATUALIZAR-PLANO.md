# 🔧 Instruções para Atualizar o Plano FREE

## ❌ Problema Atual
O plano FREE está com os valores antigos:
- **Agendamentos/dia:** 2 (deveria ser 5)
- **Agendamentos/mês:** 10 (deveria ser 110)

## ✅ Solução

### Método 1: Railway Dashboard (Recomendado)

1. **Acesse:** https://railway.app
2. **Vá para o projeto:** JFAgende
3. **Clique no serviço:** backend
4. **Vá para a aba:** "Database"
5. **Execute este SQL:**

```sql
UPDATE planos 
SET 
  "limiteAgendamentos" = 110,
  "limiteAgendamentosDia" = 5,
  "permitePortfolio" = false,
  "permiteRelatorios" = false,
  "permiteDestaque" = false,
  "diasDestaque" = 0
WHERE nome = 'FREE';
```

6. **Verifique se foi atualizado:**

```sql
SELECT 
  nome,
  "limiteAgendamentos",
  "limiteAgendamentosDia",
  "permitePortfolio",
  "permiteRelatorios",
  "permiteDestaque",
  "diasDestaque"
FROM planos 
WHERE nome = 'FREE';
```

### Método 2: Railway CLI

1. **Abra o terminal**
2. **Execute:** `railway connect backend`
3. **Execute:** `psql`
4. **Execute:** `\c jfagende`
5. **Execute o SQL acima**

## 🎯 Resultado Esperado

Após executar o SQL, o plano FREE deve ter:
- ✅ **5 agendamentos por dia**
- ✅ **110 agendamentos por mês**
- ❌ **Portfólio não permitido**
- ❌ **Relatórios não permitidos**
- ❌ **Destaque não permitido**

## 🧪 Verificação

Após executar o SQL, execute este script para verificar:

```bash
node verificacao-final-planos.js
```

## 📋 Status Atual

- ✅ API de planos funcionando
- ✅ Middleware de planos implementado
- ✅ Rotas protegidas por middleware
- ✅ Sistema de assinaturas operacional
- ❌ **Plano FREE precisa ser atualizado no banco**

## 🚀 Próximos Passos

1. Execute o SQL no banco
2. Verifique se a atualização foi aplicada
3. Teste os limites do plano FREE
4. Confirme que as restrições funcionam
