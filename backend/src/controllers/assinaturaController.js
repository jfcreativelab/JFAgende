import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// Configuração do Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY não configurada!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_invalid', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Criar sessão de pagamento para assinatura
 */
export const criarSessaoPagamento = async (req, res) => {
  try {
    console.log('🚀 INÍCIO criarSessaoPagamento');
    console.log('📋 Headers:', req.headers);
    console.log('📋 Body:', req.body);
    console.log('📋 User:', req.user);
    
    // Verificar se Stripe está configurado
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_invalid') {
      console.error('❌ Stripe não configurado');
      return res.status(500).json({ 
        error: 'Sistema de pagamento não configurado. Entre em contato com o suporte.',
        code: 'STRIPE_NOT_CONFIGURED'
      });
    }

    const { planoId, estabelecimentoId } = req.body;
    const userId = req.user.id;

    console.log('🔐 Criando sessão de pagamento:', { planoId, estabelecimentoId, userId });

    // Verificar se o estabelecimento existe
    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { id: estabelecimentoId },
      include: { plano: true }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Verificar se o usuário tem permissão para gerenciar este estabelecimento
    if (estabelecimento.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Buscar o plano
    const plano = await prisma.plano.findUnique({
      where: { id: planoId }
    });

    if (!plano) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // Verificar se já existe assinatura ativa
    const assinaturaExistente = await prisma.assinatura.findFirst({
      where: {
        estabelecimentoId: estabelecimentoId,
        status: 'ATIVA'
      }
    });

    if (assinaturaExistente) {
      return res.status(400).json({ 
        error: 'Já existe uma assinatura ativa para este estabelecimento',
        assinatura: assinaturaExistente
      });
    }

    // Criar produto no Stripe se não existir
    let stripeProduct;
    try {
      stripeProduct = await stripe.products.create({
        name: `JFAgende - ${plano.nome}`,
        description: plano.descricao || `Plano ${plano.nome} do JFAgende`,
        metadata: {
          planoId: plano.id,
          estabelecimentoId: estabelecimentoId
        }
      });
    } catch (stripeError) {
      console.error('Erro ao criar produto no Stripe:', stripeError);
      return res.status(500).json({ error: 'Erro ao configurar pagamento' });
    }

    // Criar preço no Stripe
    let stripePrice;
    try {
      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(plano.preco * 100), // Converter para centavos
        currency: 'brl',
        recurring: {
          interval: 'month'
        },
        metadata: {
          planoId: plano.id,
          estabelecimentoId: estabelecimentoId
        }
      });
    } catch (stripeError) {
      console.error('Erro ao criar preço no Stripe:', stripeError);
      return res.status(500).json({ error: 'Erro ao configurar preço' });
    }

    // Criar sessão de checkout
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: stripePrice.id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/dashboard-estabelecimento?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/planos?canceled=true`,
        customer_email: estabelecimento.email,
        metadata: {
          planoId: plano.id,
          estabelecimentoId: estabelecimentoId,
          userId: userId
        },
        subscription_data: {
          metadata: {
            planoId: plano.id,
            estabelecimentoId: estabelecimentoId,
            userId: userId
          }
        }
      });
    } catch (stripeError) {
      console.error('Erro ao criar sessão no Stripe:', stripeError);
      return res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
    }

    console.log('✅ Sessão de pagamento criada:', session.id);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Sessão de pagamento criada com sucesso'
    });

  } catch (error) {
    console.error('❌ ERRO COMPLETO criarSessaoPagamento:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};

/**
 * Obter status da assinatura
 */
export const obterStatusAssinatura = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const userId = req.user.id;

    console.log('🔍 Verificando status da assinatura:', { estabelecimentoId, userId });

    // Verificar se o estabelecimento existe
    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { id: estabelecimentoId },
      include: { 
        plano: true,
        assinaturas: {
          where: { status: 'ATIVA' },
          orderBy: { criadoEm: 'desc' },
          take: 1
        }
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Verificar se o usuário tem permissão
    if (estabelecimento.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const assinaturaAtiva = estabelecimento.assinaturas[0];

    res.json({
      success: true,
      estabelecimento: {
        id: estabelecimento.id,
        nome: estabelecimento.nome,
        plano: estabelecimento.plano
      },
      assinatura: assinaturaAtiva || null,
      temAssinaturaAtiva: !!assinaturaAtiva
    });

  } catch (error) {
    console.error('Erro ao obter status da assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * Webhook do Stripe para processar eventos
 */
export const webhookStripe = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Erro na verificação do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('🔔 Webhook recebido:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

/**
 * Processar checkout concluído
 */
async function handleCheckoutCompleted(session) {
  console.log('✅ Checkout concluído:', session.id);

  const { planoId, estabelecimentoId, userId } = session.metadata;

  // Buscar a assinatura no Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  // Criar assinatura no banco
  await prisma.assinatura.create({
    data: {
      estabelecimentoId: estabelecimentoId,
      planoId: planoId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      status: 'ATIVA',
      dataInicio: new Date(),
      dataFim: new Date(subscription.current_period_end * 1000),
      valor: subscription.items.data[0].price.unit_amount / 100
    }
  });

  // Atualizar plano do estabelecimento
  await prisma.estabelecimento.update({
    where: { id: estabelecimentoId },
    data: { planoId: planoId }
  });

  console.log('✅ Assinatura criada e estabelecimento atualizado');
}

/**
 * Processar pagamento bem-sucedido
 */
async function handlePaymentSucceeded(invoice) {
  console.log('✅ Pagamento bem-sucedido:', invoice.id);

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  
  // Atualizar data de renovação
  await prisma.assinatura.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      dataFim: new Date(subscription.current_period_end * 1000),
      status: 'ATIVA'
    }
  });
}

/**
 * Processar pagamento falhado
 */
async function handlePaymentFailed(invoice) {
  console.log('❌ Pagamento falhado:', invoice.id);

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  
  // Marcar assinatura como suspensa
  await prisma.assinatura.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'SUSPENSA' }
  });
}

/**
 * Processar assinatura cancelada
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Assinatura cancelada:', subscription.id);

  // Marcar assinatura como cancelada
  await prisma.assinatura.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { 
      status: 'CANCELADA',
      dataFim: new Date()
    }
  });
}
