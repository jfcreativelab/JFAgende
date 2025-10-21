import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Endpoint para popular o banco de dados
router.post('/populate-database', async (req, res) => {
  try {
    console.log('🌱 Iniciando população do banco de dados...')

    // Verificar se já existem planos
    const planosExistentes = await prisma.plano.count()
    if (planosExistentes > 0) {
      return res.json({ 
        success: true, 
        message: 'Planos já existem no banco de dados',
        count: planosExistentes
      })
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

    const planosCriados = []
    for (const plano of planos) {
      const planoCriado = await prisma.plano.create({
        data: plano
      })
      planosCriados.push(planoCriado)
      console.log(`✅ Plano ${plano.nome} criado`)
    }

    console.log('🎉 Banco de dados populado com sucesso!')

    res.json({
      success: true,
      message: 'Banco de dados populado com sucesso!',
      planos: planosCriados
    })

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao popular banco de dados',
      error: error.message
    })
  }
})

// Endpoint para verificar status do banco
router.get('/database-status', async (req, res) => {
  try {
    const planosCount = await prisma.plano.count()
    const estabelecimentosCount = await prisma.estabelecimento.count()
    const clientesCount = await prisma.cliente.count()

    res.json({
      success: true,
      database: {
        planos: planosCount,
        estabelecimentos: estabelecimentosCount,
        clientes: clientesCount
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status do banco',
      error: error.message
    })
  }
})

export default router
