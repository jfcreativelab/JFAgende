// Script para atualizar plano FREE diretamente no banco
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/jfagende"
    }
  }
});

async function atualizarPlanoFree() {
  try {
    console.log('🔄 Atualizando plano FREE no banco de dados...');
    
    // Primeiro, verificar o estado atual
    console.log('📊 Verificando estado atual do plano FREE...');
    const planoAtual = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    });

    if (!planoAtual) {
      console.log('❌ Plano FREE não encontrado no banco');
      return;
    }

    console.log('📦 Estado ANTES da atualização:');
    console.log(`   Limite agendamentos: ${planoAtual.limiteAgendamentos}`);
    console.log(`   Limite agendamentos/dia: ${planoAtual.limiteAgendamentosDia}`);
    console.log(`   Permite portfólio: ${planoAtual.permitePortfolio}`);
    console.log(`   Permite relatórios: ${planoAtual.permiteRelatorios}`);
    console.log(`   Permite destaque: ${planoAtual.permiteDestaque}`);
    console.log(`   Dias destaque: ${planoAtual.diasDestaque}`);

    // Atualizar o plano FREE
    console.log('\n🔄 Executando atualização...');
    const planoAtualizado = await prisma.plano.update({
      where: { nome: 'FREE' },
      data: {
        limiteAgendamentos: 110,        // 110 agendamentos por mês
        limiteAgendamentosDia: 5,       // 5 agendamentos por dia
        permitePortfolio: false,        // NÃO permite portfólio
        permiteRelatorios: false,       // NÃO permite relatórios
        permiteDestaque: false,          // NÃO permite destaque
        diasDestaque: 0                 // 0 dias de destaque
      }
    });

    console.log('✅ Plano FREE atualizado com sucesso!');
    console.log('\n📦 Estado APÓS a atualização:');
    console.log(`   Limite agendamentos: ${planoAtualizado.limiteAgendamentos}`);
    console.log(`   Limite agendamentos/dia: ${planoAtualizado.limiteAgendamentosDia}`);
    console.log(`   Permite portfólio: ${planoAtualizado.permitePortfolio}`);
    console.log(`   Permite relatórios: ${planoAtualizado.permiteRelatorios}`);
    console.log(`   Permite destaque: ${planoAtualizado.permiteDestaque}`);
    console.log(`   Dias destaque: ${planoAtualizado.diasDestaque}`);

    // Verificar se a atualização foi bem-sucedida
    const verificacao = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    });

    const sucesso = 
      verificacao.limiteAgendamentos === 110 &&
      verificacao.limiteAgendamentosDia === 5 &&
      verificacao.permitePortfolio === false &&
      verificacao.permiteRelatorios === false &&
      verificacao.permiteDestaque === false &&
      verificacao.diasDestaque === 0;

    if (sucesso) {
      console.log('\n🎉 SUCESSO! Plano FREE atualizado corretamente!');
      console.log('✅ Todas as especificações foram aplicadas:');
      console.log('   ✅ 5 agendamentos por dia');
      console.log('   ✅ 110 agendamentos por mês');
      console.log('   ❌ Portfólio não permitido');
      console.log('   ❌ Relatórios não permitidos');
      console.log('   ❌ Destaque não permitido');
    } else {
      console.log('\n❌ ERRO! A atualização não foi aplicada corretamente');
    }

  } catch (error) {
    console.error('❌ Erro ao atualizar plano FREE:', error);
    
    if (error.code === 'P2021') {
      console.log('💡 Dica: Verifique se a conexão com o banco está correta');
    } else if (error.code === 'P2002') {
      console.log('💡 Dica: Plano FREE já existe, tentando atualizar...');
    } else {
      console.log('💡 Dica: Verifique as credenciais do banco de dados');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a atualização
atualizarPlanoFree();
