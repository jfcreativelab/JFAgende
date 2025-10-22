import express from 'express'
import { authenticate, isEstabelecimento } from '../middleware/auth.js'
import { 
  criarSessaoPagamento, 
  webhookStripe, 
  obterStatusAssinatura 
} from '../controllers/pagamentoController.js'

const router = express.Router()

/**
 * @route   POST /pagamento/criar-sessao
 * @desc    Criar sessão de pagamento do Stripe
 * @access  Private (Estabelecimento)
 */
router.post('/criar-sessao', authenticate, isEstabelecimento, criarSessaoPagamento)

/**
 * @route   POST /pagamento/webhook
 * @desc    Webhook do Stripe para processar pagamentos
 * @access  Public (Stripe)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), webhookStripe)

/**
 * @route   GET /pagamento/status/:estabelecimentoId
 * @desc    Obter status da assinatura
 * @access  Private (Estabelecimento)
 */
router.get('/status/:estabelecimentoId', authenticate, isEstabelecimento, obterStatusAssinatura)

export default router




















