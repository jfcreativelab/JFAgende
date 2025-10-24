# 🔧 CONFIGURAÇÃO DO CLOUDINARY - JFAgende

## 📋 CREDENCIAIS NECESSÁRIAS

Para o upload de logos funcionar corretamente, você precisa configurar as seguintes variáveis de ambiente:

### 🚀 NO RAILWAY (PRODUÇÃO):
1. Acesse o painel do Railway
2. Vá para o projeto "jfagende-production"
3. Clique em "Variables"
4. Adicione as seguintes variáveis:

```
CLOUDINARY_CLOUD_NAME=dypmxu22a
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456789
CLOUDINARY_URL=cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz123456789@dypmxu22a
```

### 💻 LOCAL (DESENVOLVIMENTO):
1. Crie o arquivo `backend/.env.cloudinary`
2. Adicione o mesmo conteúdo acima

## ✅ APÓS CONFIGURAR:
1. O Railway vai reiniciar automaticamente
2. As logos vão funcionar perfeitamente
3. Upload e exibição funcionarão em PC e mobile

## 🔍 VERIFICAÇÃO:
- Logs do Railway devem mostrar: "Cloudinary configurado com: ✅"
- Upload de logos deve funcionar sem erro 500
- Imagens devem aparecer no app
