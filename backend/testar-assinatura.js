#!/usr/bin/env node

/**
 * Script para testar a funcionalidade de assinatura
 */

import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

console.log('🧪 Testando funcionalidade de assinatura...\n');

// Verificar variáveis de ambiente
console.log('📋 Verificando variáveis de ambiente:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurada' : '❌ Não configurada');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Configurada' : '❌ Não configurada');
console.log('');

// Testar conexão com Stripe
if (process.env.STRIPE_SECRET_KEY) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
    
    console.log('🔗 Testando conexão com Stripe...');
    const account = await stripe.accounts.retrieve();
    console.log('✅ Conexão com Stripe OK - Account:', account.id);
  } catch (error) {
    console.error('❌ Erro na conexão com Stripe:', error.message);
  }
}

// Testar conexão com banco
try {
  console.log('🗄️ Testando conexão com banco...');
  const planos = await prisma.plano.findMany();
  console.log('✅ Conexão com banco OK - Planos encontrados:', planos.length);
  
  if (planos.length > 0) {
    console.log('📋 Planos disponíveis:');
    planos.forEach(plano => {
      console.log(`  - ${plano.nome}: R$ ${plano.preco}/mês`);
    });
  }
} catch (error) {
  console.error('❌ Erro na conexão com banco:', error.message);
}

// Testar estabelecimentos
try {
  console.log('\n🏢 Testando estabelecimentos...');
  const estabelecimentos = await prisma.estabelecimento.findMany({
    take: 3,
    include: { plano: true }
  });
  console.log('✅ Estabelecimentos encontrados:', estabelecimentos.length);
  
  if (estabelecimentos.length > 0) {
    console.log('📋 Estabelecimentos:');
    estabelecimentos.forEach(est => {
      console.log(`  - ${est.nome} (${est.id}) - Plano: ${est.plano?.nome || 'N/A'}`);
    });
  }
} catch (error) {
  console.error('❌ Erro ao buscar estabelecimentos:', error.message);
}

console.log('\n✅ Teste concluído!');
process.exit(0);
