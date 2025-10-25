import express from 'express';
import { authenticate, isCliente } from '../middleware/auth.js';
import {
  criarSessaoPagamento,
  webhookStripe,
  getAssinaturasCliente,
  cancelarAssinatura,
  verificarStatusAssinatura
} from '../controllers/assinaturaPlanoController.js';

const router = express.Router();

/**
 * @route   POST /assinatura-plano/:planoId/criar-sessao
 * @desc    Criar sessão de pagamento para assinatura
 * @access  Private (Cliente)
 */
router.post('/:planoId/criar-sessao', authenticate, isCliente, criarSessaoPagamento);

/**
 * @route   POST /assinatura-plano/webhook
 * @desc    Webhook do Stripe para processar pagamentos
 * @access  Public (Stripe)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), webhookStripe);

/**
 * @route   GET /assinatura-plano/cliente/:clienteId
 * @desc    Listar assinaturas do cliente
 * @access  Private (Cliente)
 */
router.get('/cliente/:clienteId', authenticate, isCliente, getAssinaturasCliente);

/**
 * @route   PUT /assinatura-plano/:assinaturaId/cancelar
 * @desc    Cancelar assinatura
 * @access  Private (Cliente)
 */
router.put('/:assinaturaId/cancelar', authenticate, isCliente, cancelarAssinatura);

/**
 * @route   GET /assinatura-plano/status/:clienteId/:estabelecimentoId
 * @desc    Verificar status da assinatura
 * @access  Private (Cliente)
 */
router.get('/status/:clienteId/:estabelecimentoId', authenticate, isCliente, verificarStatusAssinatura);

export default router;
