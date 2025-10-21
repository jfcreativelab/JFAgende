import express from 'express';
import { authenticate, isEstabelecimento } from '../middleware/auth.js';
import { getEstatisticas, getEstatisticasGerais } from '../controllers/estatisticasController.js';

const router = express.Router();

/**
 * @route   GET /estatisticas/gerais
 * @desc    Obter estatísticas gerais do sistema
 * @access  Public
 */
router.get('/gerais', getEstatisticasGerais);

/**
 * @route   GET /estatisticas
 * @desc    Obter estatísticas do estabelecimento
 * @access  Private (Estabelecimento)
 */
router.get('/', authenticate, isEstabelecimento, getEstatisticas);

export default router;


