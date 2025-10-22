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

export default router;