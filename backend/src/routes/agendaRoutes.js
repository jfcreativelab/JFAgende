import express from 'express';
import { authenticate, isEstabelecimento } from '../middleware/auth.js';
import {
  createBloqueio,
  getBloqueios,
  deleteBloqueio,
  getAgendaCompleta,
  gerarLinkWhatsApp
} from '../controllers/agendaController.js';

const router = express.Router();

/**
 * @route   POST /agenda/bloqueios
 * @desc    Criar bloqueio de horário
 * @access  Private (Estabelecimento)
 */
router.post('/bloqueios', authenticate, isEstabelecimento, createBloqueio);

/**
 * @route   GET /agenda/bloqueios
 * @desc    Listar bloqueios
 * @access  Private (Estabelecimento)
 */
router.get('/bloqueios', authenticate, isEstabelecimento, getBloqueios);

/**
 * @route   DELETE /agenda/bloqueios/:id
 * @desc    Deletar bloqueio
 * @access  Private (Estabelecimento)
 */
router.delete('/bloqueios/:id', authenticate, isEstabelecimento, deleteBloqueio);

/**
 * @route   GET /agenda/completa
 * @desc    Obter agenda completa (agendamentos + bloqueios)
 * @access  Private (Estabelecimento)
 */
router.get('/completa', authenticate, isEstabelecimento, getAgendaCompleta);

/**
 * @route   GET /agenda/whatsapp/:id
 * @desc    Gerar link do WhatsApp para confirmação
 * @access  Private (Estabelecimento)
 */
router.get('/whatsapp/:id', authenticate, isEstabelecimento, gerarLinkWhatsApp);

export default router;


