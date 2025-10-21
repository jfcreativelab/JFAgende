import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateDatabase() {
  try {
    console.log('🌱 Iniciando população do banco de dados...')

    // Verificar se já existem planos
    const planosExistentes = await prisma.plano.count()
    if (planosExistentes > 0) {
      console.log('✅ Planos já existem no banco de dados')
      return
    }

    // Criar planos
    const planos = [
      {
        id: 'plano-free',
        nome: 'FREE',
        descricao: 'Plano gratuito para começar',
        preco: 0,
        limiteAgendamentos: 10,
        limiteAgendamentosDia: 2,
        permitePortfolio: false,
        permiteRelatorios: false,
        permiteDestaque: false,
        diasDestaque: 0,
        ativo: true
      },
      {
        id: 'plano-basic',
        nome: 'BASIC',
        descricao: 'Plano básico para pequenos negócios',
        preco: 29.90,
        limiteAgendamentos: 100,
        limiteAgendamentosDia: 10,
        permitePortfolio: true,
        permiteRelatorios: true,
        permiteDestaque: false,
        diasDestaque: 0,
        ativo: true
      },
      {
        id: 'plano-premium',
        nome: 'PREMIUM',
        descricao: 'Plano premium com todos os recursos',
        preco: 59.90,
        limiteAgendamentos: 500,
        limiteAgendamentosDia: 50,
        permitePortfolio: true,
        permiteRelatorios: true,
        permiteDestaque: true,
        diasDestaque: 7,
        ativo: true
      }
    ]

    for (const plano of planos) {
      await prisma.plano.create({
        data: plano
      })
      console.log(`✅ Plano ${plano.nome} criado`)
    }

    console.log('🎉 Banco de dados populado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateDatabase()
