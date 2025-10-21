import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAssinaturas() {
  console.log('🔧 Iniciando correção de assinaturas...\n');

  try {
    // 1. Verificar se os planos existem
    const planos = await prisma.plano.findMany();
    console.log(`📦 Planos encontrados: ${planos.length}`);
    
    if (planos.length === 0) {
      console.log('❌ Nenhum plano encontrado! Execute: npm run seed');
      process.exit(1);
    }

    planos.forEach(plano => {
      console.log(`   - ${plano.nome}: R$ ${plano.preco}`);
    });

    // 2. Buscar plano FREE
    const planoFree = planos.find(p => p.nome === 'FREE');
    
    if (!planoFree) {
      console.log('\n❌ Plano FREE não encontrado! Execute: npm run seed');
      process.exit(1);
    }

    console.log(`\n✅ Plano FREE encontrado: ${planoFree.id}`);

    // 3. Buscar estabelecimentos sem assinatura
    const estabelecimentos = await prisma.estabelecimento.findMany({
      include: {
        assinatura: true
      }
    });

    console.log(`\n🏢 Total de estabelecimentos: ${estabelecimentos.length}`);

    const estabelecimentosSemAssinatura = estabelecimentos.filter(e => !e.assinatura);
    console.log(`⚠️  Estabelecimentos sem assinatura: ${estabelecimentosSemAssinatura.length}`);

    if (estabelecimentosSemAssinatura.length === 0) {
      console.log('\n✅ Todos os estabelecimentos já têm assinatura!');
      return;
    }

    // 4. Criar assinaturas FREE para estabelecimentos sem assinatura
    console.log('\n📝 Criando assinaturas FREE...');
    let count = 0;

    for (const estabelecimento of estabelecimentosSemAssinatura) {
      try {
        await prisma.assinatura.create({
          data: {
            estabelecimentoId: estabelecimento.id,
            planoId: planoFree.id,
            ativo: true,
            status: 'ATIVA',
            dataInicio: new Date(),
            dataFim: null, // FREE não expira
          }
        });

        count++;
        console.log(`   ✅ ${count}. ${estabelecimento.nome} - Assinatura FREE criada`);
      } catch (error) {
        console.error(`   ❌ Erro ao criar assinatura para ${estabelecimento.nome}:`, error.message);
      }
    }

    console.log(`\n🎉 Concluído! ${count} assinaturas criadas com sucesso!`);

    // 5. Verificar integridade final
    console.log('\n🔍 Verificando integridade...');
    const estabelecimentosAtualizados = await prisma.estabelecimento.findMany({
      include: {
        assinatura: {
          include: {
            plano: true
          }
        }
      }
    });

    const semAssinatura = estabelecimentosAtualizados.filter(e => !e.assinatura);
    
    if (semAssinatura.length === 0) {
      console.log('✅ Todos os estabelecimentos agora têm assinatura!');
    } else {
      console.log(`⚠️  Ainda há ${semAssinatura.length} estabelecimentos sem assinatura`);
    }

  } catch (error) {
    console.error('\n❌ Erro durante a correção:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
fixAssinaturas()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

