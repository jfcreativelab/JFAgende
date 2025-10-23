# 📱 Configuração WhatsApp Business API

## 🎯 Para usar WhatsApp real, você precisa:

### 1. **Criar uma Conta WhatsApp Business**
- Acesse: https://business.whatsapp.com/
- Crie uma conta ou faça login
- Verifique seu número de telefone

### 2. **Configurar Meta for Developers**
- Acesse: https://developers.facebook.com/
- Crie um app do tipo "Business"
- Adicione o produto "WhatsApp Business API"

### 3. **Obter Credenciais**
- **Access Token**: Token de acesso da API
- **Phone Number ID**: ID do número de telefone verificado
- **Verify Token**: Token de verificação (você escolhe)

### 4. **Configurar Variáveis de Ambiente**
Adicione no arquivo `.env` do backend:

```env
WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_VERIFY_TOKEN=seu_verify_token_aqui
```

### 5. **Deploy no Railway**
- Adicione as variáveis no painel do Railway
- Faça deploy das alterações
- Teste a funcionalidade

## 🔧 Configuração Atual

**Status**: Modo de demonstração ativo
**QR Code**: Apenas para demonstração visual
**Mensagens**: Simuladas no console

## 📋 Próximos Passos

1. Configure as credenciais do WhatsApp Business
2. Adicione as variáveis de ambiente
3. Faça deploy
4. Teste com mensagens reais

## ⚠️ Importante

- O WhatsApp Business API é **gratuito** para até 1.000 mensagens/mês
- Após isso, há cobrança por mensagem
- É necessário verificar o número de telefone
- Apenas números verificados podem enviar mensagens
