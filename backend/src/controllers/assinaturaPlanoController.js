import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Criar sessão de pagamento para assinatura
export const criarSessaoPagamento = async (req, res) => {
  try {
    const { planoId } = req.params;
    const { clienteId } = req.body;

    // Verificar se o plano existe
    const plano = await prisma.planoEstabelecimento.findUnique({
      where: { id: planoId },
      include: { estabelecimento: true }
    });

    if (!plano) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // Verificar se o cliente já tem assinatura ativa para este plano
    const assinaturaExistente = await prisma.assinaturaPlano.findFirst({
      where: {
        clienteId,
        planoEstabelecimentoId: planoId,
        ativo: true
      }
    });

    if (assinaturaExistente) {
      return res.status(400).json({ 
        error: 'Você já possui uma assinatura ativa para este plano' 
      });
    }

    // Criar sessão de pagamento no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `${plano.nome} - ${plano.estabelecimento.nome}`,
              description: plano.descricao,
            },
            unit_amount: Math.round(plano.preco * 100), // Converter para centavos
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/assinatura/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/estabelecimento/${plano.estabelecimentoId}?tab=planos`,
      metadata: {
        clienteId,
        planoId,
        estabelecimentoId: plano.estabelecimentoId
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de pagamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Webhook do Stripe para processar pagamentos
export const webhookStripe = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

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
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Processar checkout concluído
async function handleCheckoutCompleted(session) {
  const { clienteId, planoId } = session.metadata;

  // Criar assinatura no banco
  await prisma.assinaturaPlano.create({
    data: {
      clienteId,
      planoEstabelecimentoId: planoId,
      ativo: true,
      dataInicio: new Date(),
      servicosUtilizados: {}
    }
  });

  console.log(`Assinatura criada para cliente ${clienteId}, plano ${planoId}`);
}

// Processar pagamento bem-sucedido
async function handlePaymentSucceeded(invoice) {
  // Renovar assinatura se necessário
  console.log('Pagamento processado com sucesso:', invoice.id);
}

// Processar pagamento falhado
async function handlePaymentFailed(invoice) {
  // Desativar assinatura ou notificar cliente
  console.log('Pagamento falhou:', invoice.id);
}

// Processar cancelamento de assinatura
async function handleSubscriptionDeleted(subscription) {
  // Desativar assinatura no banco
  console.log('Assinatura cancelada:', subscription.id);
}

// Listar assinaturas do cliente
export const getAssinaturasCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const assinaturas = await prisma.assinaturaPlano.findMany({
      where: { clienteId },
      include: {
        planoEstabelecimento: {
          include: {
            estabelecimento: {
              select: { id: true, nome: true, fotoPerfilUrl: true }
            }
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    res.json(assinaturas);
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Cancelar assinatura
export const cancelarAssinatura = async (req, res) => {
  try {
    const { assinaturaId } = req.params;

    const assinatura = await prisma.assinaturaPlano.findUnique({
      where: { id: assinaturaId }
    });

    if (!assinatura) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Atualizar assinatura para inativa
    await prisma.assinaturaPlano.update({
      where: { id: assinaturaId },
      data: {
        ativo: false,
        dataFim: new Date()
      }
    });

    res.json({ message: 'Assinatura cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Verificar status da assinatura
export const verificarStatusAssinatura = async (req, res) => {
  try {
    const { clienteId, estabelecimentoId } = req.params;

    const assinatura = await prisma.assinaturaPlano.findFirst({
      where: {
        clienteId,
        planoEstabelecimento: {
          estabelecimentoId
        },
        ativo: true
      },
      include: {
        planoEstabelecimento: true
      }
    });

    res.json({ 
      temAssinatura: !!assinatura,
      assinatura: assinatura || null
    });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
