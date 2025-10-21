import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar planos se não existirem
  const planosExistentes = await prisma.plano.count();
  
  if (planosExistentes === 0) {
    console.log('📦 Criando planos...');

    // Plano FREE
    await prisma.plano.create({
      data: {
        nome: 'FREE',
        descricao: 'Plano gratuito com funcionalidades básicas',
        preco: 0,
        limiteAgendamentos: -1, // Ilimitado por mês
        limiteAgendamentosDia: 5, // Máximo 5 por dia
        permitePortfolio: false,
        permiteRelatorios: false,
        permiteDestaque: false,
        diasDestaque: 0,
        ativo: true
      }
    });

    // Plano BASIC
    await prisma.plano.create({
      data: {
        nome: 'BASIC',
        descricao: 'Plano básico para pequenos estabelecimentos',
        preco: 25.90,
        limiteAgendamentos: 30, // 30 agendamentos por mês
        limiteAgendamentosDia: null, // Sem limite por dia
        permitePortfolio: true,
        permiteRelatorios: true,
        permiteDestaque: false,
        diasDestaque: 0,
        ativo: true
      }
    });

    // Plano PREMIUM
    await prisma.plano.create({
      data: {
        nome: 'PREMIUM',
        descricao: 'Plano completo com todos os recursos',
        preco: 49.90,
        limiteAgendamentos: -1, // Ilimitado
        limiteAgendamentosDia: null, // Sem limite por dia
        permitePortfolio: true,
        permiteRelatorios: true,
        permiteDestaque: true,
        diasDestaque: 7, // 7 dias de destaque
        ativo: true
      }
    });

    console.log('✅ Planos criados com sucesso!');
  } else {
    console.log('ℹ️  Planos já existem, pulando criação...');
  }

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

