/**
 * Script para criar produtos e preços no Stripe
 * 
 * Este script automatiza a criação de produtos no Stripe
 * sincronizados com os planos do banco de dados
 */

import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();

// Verificar se a chave do Stripe está configurada
if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('COLE_AQUI')) {
  console.error('❌ ERRO: Configure a chave STRIPE_SECRET_KEY no arquivo .env');
  console.error('📖 Leia IMPLEMENTACAO_STRIPE_PRODUCAO.md para instruções');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/**
 * Cria um produto no Stripe
 */
async function criarProdutoStripe(plano) {
  try {
    console.log(`\n📦 Criando produto: ${plano.nome}`);

    // Criar produto
    const product = await stripe.products.create({
      name: `JFAgende - Plano ${plano.nome}`,
      description: plano.descricao,
      metadata: {
        plano_id: plano.id,
        plano_nome: plano.nome,
      },
    });

    console.log(`   ✅ Produto criado: ${product.id}`);

    // Criar preço recorrente
    const price = await stripe.prices.create({
      product: product.id,
      currency: 'brl',
      unit_amount: Math.round(plano.preco * 100), // Converter para centavos
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      metadata: {
        plano_id: plano.id,
        plano_nome: plano.nome,
      },
    });

    console.log(`   ✅ Preço criado: ${price.id}`);
    console.log(`   💰 Valor: R$ ${plano.preco.toFixed(2)}/mês`);

    return {
      productId: product.id,
      priceId: price.id,
    };
  } catch (error) {
    console.error(`   ❌ Erro ao criar produto ${plano.nome}:`, error.message);
    throw error;
  }
}

/**
 * Atualizar plano no banco com IDs do Stripe
 */
async function atualizarPlanoBanco(planoId, stripeProductId, stripePriceId) {
  try {
    await prisma.plano.update({
      where: { id: planoId },
      data: {
        stripeProductId,
        stripePriceId,
      },
    });
    console.log(`   ✅ Plano atualizado no banco de dados`);
  } catch (error) {
    console.error(`   ❌ Erro ao atualizar banco:`, error.message);
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Setup de Produtos no Stripe\n');
  console.log('================================================');
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Modo Stripe: ${process.env.STRIPE_SECRET_KEY.startsWith('sk_live') ? 'PRODUÇÃO (LIVE)' : 'TESTE (TEST)'}`);
  console.log('================================================\n');

  try {
    // 1. Buscar planos do banco (exceto FREE)
    const planos = await prisma.plano.findMany({
      where: {
        nome: {
          not: 'FREE', // FREE não precisa de produto no Stripe
        },
        ativo: true,
      },
    });

    if (planos.length === 0) {
      console.log('⚠️  Nenhum plano encontrado no banco.');
      console.log('   Execute: npm run seed');
      return;
    }

    console.log(`📋 Encontrados ${planos.length} planos para criar no Stripe:\n`);
    planos.forEach(p => {
      console.log(`   • ${p.nome} - R$ ${p.preco.toFixed(2)}/mês`);
    });

    console.log('\n⏳ Criando produtos no Stripe...\n');

    // 2. Criar cada produto no Stripe
    const resultados = [];
    for (const plano of planos) {
      try {
        const { productId, priceId } = await criarProdutoStripe(plano);
        await atualizarPlanoBanco(plano.id, productId, priceId);
        
        resultados.push({
          plano: plano.nome,
          productId,
          priceId,
          sucesso: true,
        });
      } catch (error) {
        resultados.push({
          plano: plano.nome,
          erro: error.message,
          sucesso: false,
        });
      }
    }

    // 3. Resumo
    console.log('\n\n================================================');
    console.log('📊 RESUMO DA CRIAÇÃO');
    console.log('================================================\n');

    const sucessos = resultados.filter(r => r.sucesso);
    const falhas = resultados.filter(r => !r.sucesso);

    console.log(`✅ Sucessos: ${sucessos.length}`);
    console.log(`❌ Falhas: ${falhas.length}\n`);

    if (sucessos.length > 0) {
      console.log('✅ Produtos criados com sucesso:\n');
      sucessos.forEach(r => {
        console.log(`   ${r.plano}:`);
        console.log(`      Product ID: ${r.productId}`);
        console.log(`      Price ID: ${r.priceId}`);
        console.log('');
      });
    }

    if (falhas.length > 0) {
      console.log('❌ Produtos com falha:\n');
      falhas.forEach(r => {
        console.log(`   ${r.plano}: ${r.erro}`);
      });
      console.log('');
    }

    // 4. Instruções finais
    if (sucessos.length > 0) {
      console.log('================================================');
      console.log('📝 PRÓXIMOS PASSOS');
      console.log('================================================\n');
      console.log('1. Anote os Price IDs acima');
      console.log('2. Adicione no arquivo .env:');
      console.log('');
      
      sucessos.forEach(r => {
        const varName = `STRIPE_PRICE_${r.plano.toUpperCase()}`;
        console.log(`   ${varName}=${r.priceId}`);
      });

      console.log('\n3. Reinicie o servidor backend');
      console.log('4. Configure o webhook no Stripe Dashboard');
      console.log('');
      console.log('🎉 Setup concluído com sucesso!');
    }

  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
main()
  .then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

