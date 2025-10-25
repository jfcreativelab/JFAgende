#!/usr/bin/env node

/**
 * Script para configurar variáveis do Stripe no Railway
 * Execute: node configurar-stripe-railway.js
 */

console.log('🔧 Configuração do Stripe no Railway');
console.log('=====================================\n');

console.log('📋 VARIÁVEIS NECESSÁRIAS:');
console.log('');

console.log('1. STRIPE_SECRET_KEY');
console.log('   - Acesse: https://dashboard.stripe.com/test/apikeys');
console.log('   - Copie a "Secret key" (sk_test_...)');
console.log('');

console.log('2. STRIPE_PUBLISHABLE_KEY');
console.log('   - Acesse: https://dashboard.stripe.com/test/apikeys');
console.log('   - Copie a "Publishable key" (pk_test_...)');
console.log('');

console.log('3. STRIPE_WEBHOOK_SECRET');
console.log('   - Acesse: https://dashboard.stripe.com/test/webhooks');
console.log('   - Crie um webhook para: https://jfagende-production.up.railway.app/api/pagamento/webhook');
console.log('   - Copie o "Signing secret" (whsec_...)');
console.log('');

console.log('4. FRONTEND_URL');
console.log('   - URL do frontend: https://jf-agende.vercel.app');
console.log('');

console.log('🚀 COMANDOS PARA CONFIGURAR NO RAILWAY:');
console.log('');

console.log('railway variables set STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_AQUI');
console.log('railway variables set STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI');
console.log('railway variables set STRIPE_WEBHOOK_SECRET=whsec_SUA_CHAVE_AQUI');
console.log('railway variables set FRONTEND_URL=https://jf-agende.vercel.app');
console.log('');

console.log('📝 INSTRUÇÕES DETALHADAS:');
console.log('');

console.log('1. Acesse o Railway Dashboard: https://railway.app');
console.log('2. Selecione seu projeto JFAgende');
console.log('3. Vá em "Variables"');
console.log('4. Adicione as variáveis acima');
console.log('5. Faça redeploy do serviço');
console.log('');

console.log('✅ Após configurar, teste a assinatura novamente!');
