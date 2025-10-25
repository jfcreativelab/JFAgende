import express from 'express';
import { authenticate, isEstabelecimento } from '../middleware/auth.js';
import {
  getPlanosByEstabelecimento,
  createPlano,
  updatePlano,
  deletePlano,
  getPlanoById,
  reordenarPlanos,
  getEstatisticasPlanos
} from '../controllers/planoEstabelecimentoController.js';

const router = express.Router();

/**
 * @route   GET /planos-estabelecimento/:estabelecimentoId
 * @desc    Listar planos de um estabelecimento
 * @access  Public
 */
router.get('/:estabelecimentoId', getPlanosByEstabelecimento);

/**
 * @route   GET /planos-estabelecimento/plano/:planoId
 * @desc    Obter plano específico
 * @access  Public
 */
router.get('/plano/:planoId', getPlanoById);

/**
 * @route   GET /planos-estabelecimento/:estabelecimentoId/estatisticas
 * @desc    Obter estatísticas dos planos
 * @access  Private (Estabelecimento)
 */
router.get('/:estabelecimentoId/estatisticas', authenticate, isEstabelecimento, getEstatisticasPlanos);

/**
 * @route   POST /planos-estabelecimento/:estabelecimentoId
 * @desc    Criar novo plano
 * @access  Private (Estabelecimento)
 */
router.post('/:estabelecimentoId', authenticate, isEstabelecimento, createPlano);

/**
 * @route   PUT /planos-estabelecimento/:planoId
 * @desc    Atualizar plano
 * @access  Private (Estabelecimento)
 */
router.put('/:planoId', authenticate, isEstabelecimento, updatePlano);

/**
 * @route   DELETE /planos-estabelecimento/:planoId
 * @desc    Deletar plano
 * @access  Private (Estabelecimento)
 */
router.delete('/:planoId', authenticate, isEstabelecimento, deletePlano);

/**
 * @route   PUT /planos-estabelecimento/:estabelecimentoId/reordenar
 * @desc    Reordenar planos
 * @access  Private (Estabelecimento)
 */
router.put('/:estabelecimentoId/reordenar', authenticate, isEstabelecimento, reordenarPlanos);

export default router;
