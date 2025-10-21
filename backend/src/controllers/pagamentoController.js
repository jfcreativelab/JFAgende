import { PrismaClient } from '@prisma/client'
import stripe from '../config/stripe.js'

const prisma = new PrismaClient()

/**
 * Criar sessão de pagamento do Stripe
 */
export const criarSessaoPagamento = async (req, res) => {
  try {
    const { planoId, estabelecimentoId } = req.body

    console.log('[PAGAMENTO] Criando sessão:', { planoId, estabelecimentoId })

    if (!planoId || !estabelecimentoId) {
      return res.status(400).json({ error: 'planoId e estabelecimentoId são obrigatórios' })
    }

    // Buscar o plano (UUID, não parseInt!)
    const plano = await prisma.plano.findUnique({
      where: { id: planoId }
    })

    if (!plano) {
      console.error('[PAGAMENTO] Plano não encontrado:', planoId)
      return res.status(404).json({ error: 'Plano não encontrado' })
    }

    // Buscar o estabelecimento (UUID, não parseInt!)
    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { id: estabelecimentoId }
    })

    if (!estabelecimento) {
      console.error('[PAGAMENTO] Estabelecimento não encontrado:', estabelecimentoId)
      return res.status(404).json({ error: 'Estabelecimento não encontrado' })
    }

    console.log('[PAGAMENTO] Plano encontrado:', plano.nome, 'Preço:', plano.preco)

    // Verificar se o plano tem stripePriceId
    if (!plano.stripePriceId) {
      console.error('[PAGAMENTO] ❌ Plano sem Price ID do Stripe:', plano.nome)
      return res.status(400).json({ 
        error: 'Plano não configurado corretamente. Execute: npm run setup-stripe' 
      })
    }

    console.log('[PAGAMENTO] Usando Price ID:', plano.stripePriceId)

    // Criar sessão de pagamento no Stripe usando Price ID pré-criado
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plano.stripePriceId, // Usar Price ID pré-criado
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/assinatura/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/assinatura/cancelado`,
      metadata: {
        planoId: plano.id,
        estabelecimentoId: estabelecimento.id,
      },
    })

    console.log('[PAGAMENTO] Sessão criada com sucesso:', session.id)
    res.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Erro ao criar sessão de pagamento:', error)
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento' })
  }
}

/**
 * Webhook do Stripe para processar pagamentos
 */
export const webhookStripe = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder')
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // Processar o evento
    switch (event.type) {
      case 'checkout.session.completed':
        await processarPagamentoConcluido(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await processarRenovacaoAssinatura(event.data.object)
        break
      case 'invoice.payment_failed':
        await processarFalhaPagamento(event.data.object)
        break
      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    res.status(500).json({ error: 'Erro ao processar webhook' })
  }
}

/**
 * Processar pagamento concluído
 */
async function processarPagamentoConcluido(session) {
  const { planoId, estabelecimentoId } = session.metadata

  console.log('[WEBHOOK] Processando pagamento concluído:', { planoId, estabelecimentoId })

  try {
    // Buscar o plano para obter informações de destaque
    const plano = await prisma.plano.findUnique({
      where: { id: planoId }
    })

    if (!plano) {
      console.error('[WEBHOOK] Plano não encontrado:', planoId)
      return
    }

    const dataInicio = new Date()
    const dataFim = plano.nome === 'FREE' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const destaqueAte = plano.diasDestaque > 0 
      ? new Date(dataInicio.getTime() + plano.diasDestaque * 24 * 60 * 60 * 1000) 
      : null

    // Atualizar assinatura do estabelecimento
    await prisma.assinatura.upsert({
      where: { estabelecimentoId: estabelecimentoId },
      update: {
        planoId: planoId,
        ativo: true,
        status: 'ATIVA',
        dataInicio: dataInicio,
        dataFim: dataFim,
        destaqueAte: destaqueAte,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        autoRenovar: true,
      },
      create: {
        estabelecimentoId: estabelecimentoId,
        planoId: planoId,
        ativo: true,
        status: 'ATIVA',
        dataInicio: dataInicio,
        dataFim: dataFim,
        destaqueAte: destaqueAte,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        autoRenovar: true,
      }
    })

    console.log(`✅ Assinatura ativada para estabelecimento ${estabelecimentoId}, plano ${plano.nome}`)
  } catch (error) {
    console.error('[WEBHOOK] Erro ao processar pagamento:', error)
    throw error
  }
}

/**
 * Processar renovação de assinatura
 */
async function processarRenovacaoAssinatura(invoice) {
  const subscriptionId = invoice.subscription

  // Atualizar data de fim da assinatura
  await prisma.assinatura.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      status: 'ATIVA'
    }
  })

  console.log(`✅ Assinatura renovada: ${subscriptionId}`)
}

/**
 * Processar falha de pagamento
 */
async function processarFalhaPagamento(invoice) {
  const subscriptionId = invoice.subscription

  // Marcar assinatura como suspensa
  await prisma.assinatura.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: 'SUSPENSA' }
  })

  console.log(`❌ Falha no pagamento da assinatura: ${subscriptionId}`)
}

/**
 * Obter status da assinatura
 */
export const obterStatusAssinatura = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params

    console.log('[PAGAMENTO] Buscando status da assinatura:', estabelecimentoId)

    const assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId: estabelecimentoId },
      include: {
        plano: true
      }
    })

    if (!assinatura) {
      console.log('[PAGAMENTO] Nenhuma assinatura encontrada para:', estabelecimentoId)
      
      // Buscar plano FREE padrão
      const planoFree = await prisma.plano.findFirst({
        where: { nome: 'FREE' }
      })

      return res.json({ 
        status: 'INATIVA',
        plano: planoFree,
        dataFim: null,
        mensagem: 'Nenhuma assinatura ativa. Usando plano FREE.'
      })
    }

    console.log('[PAGAMENTO] Assinatura encontrada:', assinatura.status, 'Plano:', assinatura.plano?.nome)

    res.json({
      status: assinatura.status,
      ativo: assinatura.ativo,
      plano: assinatura.plano,
      dataInicio: assinatura.dataInicio,
      dataFim: assinatura.dataFim,
      destaqueAte: assinatura.destaqueAte,
      autoRenovar: assinatura.autoRenovar,
    })
  } catch (error) {
    console.error('[PAGAMENTO] Erro ao obter status da assinatura:', error)
    res.status(500).json({ error: 'Erro ao obter status da assinatura', details: error.message })
  }
}

