/**
 * Script para verificar configuração do Stripe
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔍 Verificando Configuração do Stripe\n');
console.log('================================================\n');

// 1. Verificar variáveis de ambiente
console.log('1️⃣ Variáveis de Ambiente:\n');

const checks = [
  { nome: 'STRIPE_SECRET_KEY', valor: process.env.STRIPE_SECRET_KEY },
  { nome: 'STRIPE_PUBLISHABLE_KEY', valor: process.env.STRIPE_PUBLISHABLE_KEY },
  { nome: 'STRIPE_WEBHOOK_SECRET', valor: process.env.STRIPE_WEBHOOK_SECRET },
];

let todasConfiguradas = true;

checks.forEach(check => {
  const configurada = check.valor && !check.valor.includes('COLE_AQUI');
  const simbolo = configurada ? '✅' : '❌';
  
  console.log(`   ${simbolo} ${check.nome}`);
  
  if (configurada) {
    const prefixo = check.valor.substring(0, 15);
    const modo = check.valor.startsWith('sk_live') || check.valor.startsWith('pk_live') 
      ? '(LIVE - Produção)' 
      : check.valor.startsWith('sk_test') || check.valor.startsWith('pk_test')
      ? '(TEST - Desenvolvimento)'
      : '(MODO DESCONHECIDO)';
    console.log(`      ${prefixo}... ${modo}`);
  } else {
    console.log(`      ⚠️  Não configurada`);
    todasConfiguradas = false;
  }
  console.log('');
});

if (!todasConfiguradas) {
  console.log('❌ Configuração incompleta!\n');
  console.log('📖 Leia: IMPLEMENTACAO_STRIPE_PRODUCAO.md');
  console.log('');
  process.exit(1);
}

// 2. Testar conexão com Stripe
console.log('2️⃣ Testando Conexão com Stripe:\n');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function testarConexao() {
  try {
    const account = await stripe.account.retrieve();
    
    console.log(`   ✅ Conexão estabelecida com sucesso!`);
    console.log(`   📧 Email: ${account.email || 'N/A'}`);
    console.log(`   🏢 Nome: ${account.business_profile?.name || 'N/A'}`);
    console.log(`   🌍 País: ${account.country}`);
    console.log(`   💳 Cobrança habilitada: ${account.charges_enabled ? 'Sim' : 'Não'}`);
    console.log(`   💰 Pagamentos habilitados: ${account.payouts_enabled ? 'Sim' : 'Não'}`);
    console.log('');

    // 3. Listar produtos
    console.log('3️⃣ Produtos Existentes no Stripe:\n');
    
    const products = await stripe.products.list({ limit: 10 });
    
    if (products.data.length === 0) {
      console.log('   ⚠️  Nenhum produto encontrado');
      console.log('   💡 Execute: npm run setup-stripe-products');
      console.log('');
    } else {
      console.log(`   📦 ${products.data.length} produto(s) encontrado(s):\n`);
      
      for (const product of products.data) {
        console.log(`   • ${product.name}`);
        console.log(`     ID: ${product.id}`);
        console.log(`     Ativo: ${product.active ? 'Sim' : 'Não'}`);
        
        // Buscar preços do produto
        const prices = await stripe.prices.list({ product: product.id, limit: 1 });
        if (prices.data.length > 0) {
          const price = prices.data[0];
          const valor = (price.unit_amount / 100).toFixed(2);
          const moeda = price.currency.toUpperCase();
          console.log(`     Preço: ${moeda} ${valor}/${price.recurring?.interval || 'único'}`);
          console.log(`     Price ID: ${price.id}`);
        }
        console.log('');
      }
    }

    // 4. Resumo final
    console.log('================================================');
    console.log('✅ CONFIGURAÇÃO VÁLIDA');
    console.log('================================================\n');
    console.log('Seu Stripe está configurado e funcionando!\n');

    if (products.data.length === 0) {
      console.log('📝 Próximo passo:');
      console.log('   Execute: npm run setup-stripe-products');
      console.log('');
    }

  } catch (error) {
    console.log('   ❌ Erro ao conectar com Stripe\n');
    console.log(`   Tipo: ${error.type}`);
    console.log(`   Mensagem: ${error.message}`);
    console.log('');
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('💡 Solução:');
      console.log('   1. Verifique se a chave STRIPE_SECRET_KEY está correta');
      console.log('   2. Acesse: https://dashboard.stripe.com/apikeys');
      console.log('   3. Copie a chave correta e cole no .env');
      console.log('');
    }
    
    process.exit(1);
  }
}

testarConexao();

