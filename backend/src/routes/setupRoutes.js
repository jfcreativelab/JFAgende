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

// Endpoint para configurar Stripe
router.post('/setup-stripe', async (req, res) => {
  try {
    console.log('🚀 Iniciando setup do Stripe...')

    // Verificar se a chave do Stripe está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({
        success: false,
        message: 'STRIPE_SECRET_KEY não configurada no Railway'
      })
    }

    const stripe = (await import('stripe')).default
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    // Buscar planos (exceto FREE)
    const planos = await prisma.plano.findMany({
      where: {
        nome: { not: 'FREE' },
        ativo: true,
      },
    })

    if (planos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum plano encontrado para configurar no Stripe'
      })
    }

    const resultados = []

    for (const plano of planos) {
      try {
        // Criar produto no Stripe
        const product = await stripeClient.products.create({
          name: `JFAgende - Plano ${plano.nome}`,
          description: plano.descricao,
          metadata: {
            plano_id: plano.id,
            plano_nome: plano.nome,
          },
        })

        // Criar preço no Stripe
        const price = await stripeClient.prices.create({
          product: product.id,
          currency: 'brl',
          unit_amount: Math.round(plano.preco * 100),
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
          metadata: {
            plano_id: plano.id,
            plano_nome: plano.nome,
          },
        })

        // Atualizar plano no banco
        await prisma.plano.update({
          where: { id: plano.id },
          data: {
            stripeProductId: product.id,
            stripePriceId: price.id,
          },
        })

        resultados.push({
          plano: plano.nome,
          productId: product.id,
          priceId: price.id,
          sucesso: true
        })

        console.log(`✅ ${plano.nome}: ${price.id}`)
      } catch (error) {
        resultados.push({
          plano: plano.nome,
          erro: error.message,
          sucesso: false
        })
        console.error(`❌ ${plano.nome}: ${error.message}`)
      }
    }

    res.json({
      success: true,
      message: 'Setup do Stripe concluído',
      resultados
    })

  } catch (error) {
    console.error('❌ Erro no setup do Stripe:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao configurar Stripe',
      error: error.message
    })
  }
})

export default router
