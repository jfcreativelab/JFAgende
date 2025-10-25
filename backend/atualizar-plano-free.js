import { PrismaClient } from '@prisma/client';

// Configurar para usar SQLite local
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
});

async function atualizarPlanoFree() {
  try {
    console.log('🔄 Atualizando plano FREE...');
    
    // Buscar o plano FREE
    const planoFree = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    });

    if (!planoFree) {
      console.log('❌ Plano FREE não encontrado');
      return;
    }

    console.log('📊 Dados atuais do plano FREE:');
    console.log('- Limite agendamentos:', planoFree.limiteAgendamentos);
    console.log('- Limite agendamentos/dia:', planoFree.limiteAgendamentosDia);
    console.log('- Permite portfólio:', planoFree.permitePortfolio);
    console.log('- Permite relatórios:', planoFree.permiteRelatorios);
    console.log('- Permite destaque:', planoFree.permiteDestaque);
    console.log('- Dias destaque:', planoFree.diasDestaque);

    // Atualizar o plano FREE com as novas especificações
    const planoAtualizado = await prisma.plano.update({
      where: { id: planoFree.id },
      data: {
        limiteAgendamentos: 110,        // 110 agendamentos por mês
        limiteAgendamentosDia: 5,       // 5 agendamentos por dia
        permitePortfolio: false,        // NÃO permite portfólio
        permiteRelatorios: false,       // NÃO permite relatórios
        permiteDestaque: false,         // NÃO permite destaque
        diasDestaque: 0                 // 0 dias de destaque
      }
    });

    console.log('✅ Plano FREE atualizado com sucesso!');
    console.log('📊 Novos dados do plano FREE:');
    console.log('- Limite agendamentos:', planoAtualizado.limiteAgendamentos);
    console.log('- Limite agendamentos/dia:', planoAtualizado.limiteAgendamentosDia);
    console.log('- Permite portfólio:', planoAtualizado.permitePortfolio);
    console.log('- Permite relatórios:', planoAtualizado.permiteRelatorios);
    console.log('- Permite destaque:', planoAtualizado.permiteDestaque);
    console.log('- Dias destaque:', planoAtualizado.diasDestaque);

  } catch (error) {
    console.error('❌ Erro ao atualizar plano FREE:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarPlanoFree();
