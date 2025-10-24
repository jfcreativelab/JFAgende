import express from 'express';
import { authenticate, isEstabelecimento } from '../middleware/auth.js';
import { verificarPermissaoRecurso } from '../middleware/planoMiddleware.js';
import { upload } from '../utils/upload.js';
import {
  uploadFoto,
  getFotos,
  getEstatisticas,
  updateFoto,
  deleteFoto,
  reordenarFotos,
  getCategorias
} from '../controllers/portfolioController.js';

const router = express.Router();

/**
 * @route   POST /portfolio/upload
 * @desc    Upload de foto para portfólio
 * @access  Private (Estabelecimento)
 */
router.post('/upload', authenticate, isEstabelecimento, verificarPermissaoRecurso('portfolio'), upload.single('imagem'), uploadFoto);

/**
 * @route   GET /portfolio/estabelecimento/:estabelecimentoId
 * @desc    Listar fotos do portfólio de um estabelecimento
 * @access  Public
 */
router.get('/estabelecimento/:estabelecimentoId', getFotos);

/**
 * @route   GET /portfolio/estatisticas
 * @desc    Obter estatísticas do portfólio
 * @access  Private (Estabelecimento)
 */
router.get('/estatisticas', authenticate, isEstabelecimento, getEstatisticas);

/**
 * @route   GET /portfolio/categorias
 * @desc    Obter categorias disponíveis
 * @access  Public
 */
router.get('/categorias', getCategorias);

/**
 * @route   PUT /portfolio/:id
 * @desc    Atualizar foto do portfólio
 * @access  Private (Estabelecimento)
 */
router.put('/:id', authenticate, isEstabelecimento, updateFoto);

/**
 * @route   DELETE /portfolio/:id
 * @desc    Deletar foto do portfólio
 * @access  Private (Estabelecimento)
 */
router.delete('/:id', authenticate, isEstabelecimento, deleteFoto);

/**
 * @route   PUT /portfolio/reordenar
 * @desc    Reordenar fotos do portfólio
 * @access  Private (Estabelecimento)
 */
router.put('/reordenar/fotos', authenticate, isEstabelecimento, reordenarFotos);

export default router;


