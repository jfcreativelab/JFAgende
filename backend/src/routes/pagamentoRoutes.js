import express from 'express';
import { authenticate, isCliente, isEstabelecimento } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import {
  gerarQrCodePix,
  uploadComprovantePix,
  confirmarPagamentoPix,
  rejeitarPagamentoPix,
  listarPagamentosPendentes
} from '../controllers/pagamentoController.js';
import {
  criarSessaoPagamento,
  obterStatusAssinatura,
  webhookStripe
} from '../controllers/assinaturaController.js';

const router = express.Router();

/**
 * @route   GET /pagamento/:agendamentoId/qrcode
 * @desc    Gera QR Code para pagamento PIX
 * @access  Private (Cliente)
 */
router.get('/:agendamentoId/qrcode', authenticate, isCliente, gerarQrCodePix);

/**
 * @route   POST /pagamento/:agendamentoId/comprovante
 * @desc    Upload de comprovante PIX
 * @access  Private (Cliente)
 */
router.post('/:agendamentoId/comprovante', authenticate, isCliente, upload.single('comprovante'), uploadComprovantePix);

/**
 * @route   POST /pagamento/:agendamentoId/confirmar
 * @desc    Confirmar pagamento PIX
 * @access  Private (Estabelecimento)
 */
router.post('/:agendamentoId/confirmar', authenticate, isEstabelecimento, confirmarPagamentoPix);

/**
 * @route   POST /pagamento/:agendamentoId/rejeitar
 * @desc    Rejeitar pagamento PIX
 * @access  Private (Estabelecimento)
 */
router.post('/:agendamentoId/rejeitar', authenticate, isEstabelecimento, rejeitarPagamentoPix);

/**
 * @route   GET /pagamento/pendentes
 * @desc    Listar pagamentos pendentes
 * @access  Private (Estabelecimento)
 */
router.get('/pendentes', authenticate, isEstabelecimento, listarPagamentosPendentes);

/**
 * @route   POST /pagamento/criar-sessao
 * @desc    Criar sessão de pagamento para assinatura
 * @access  Private (Estabelecimento)
 */
router.post('/criar-sessao', authenticate, isEstabelecimento, criarSessaoPagamento);

/**
 * @route   GET /pagamento/status/:estabelecimentoId
 * @desc    Obter status da assinatura
 * @access  Private (Estabelecimento)
 */
router.get('/status/:estabelecimentoId', authenticate, isEstabelecimento, obterStatusAssinatura);

/**
 * @route   POST /pagamento/webhook
 * @desc    Webhook do Stripe
 * @access  Public (Stripe)
 */
router.post('/webhook', webhookStripe);

export default router;