import express from 'express';
import { authenticate, isEstabelecimento } from '../middleware/auth.js';
import {
  getEstabelecimentos,
  getEstabelecimentoById,
  updateEstabelecimento,
  createServico,
  getServicos,
  updateServico,
  deleteServico,
  createHorario
} from '../controllers/estabelecimentoController.js';

const router = express.Router();

/**
 * @route   GET /estabelecimentos
 * @desc    Lista todos os estabelecimentos (com filtros)
 * @access  Public
 */
router.get('/', getEstabelecimentos);

/**
 * @route   GET /estabelecimentos/:id
 * @desc    Obtém detalhes de um estabelecimento
 * @access  Public
 */
router.get('/:id', getEstabelecimentoById);

/**
 * @route   PUT /estabelecimentos/:id
 * @desc    Atualiza dados do estabelecimento
 * @access  Private (Estabelecimento)
 */
router.put('/:id', authenticate, isEstabelecimento, updateEstabelecimento);

/**
 * @route   POST /estabelecimentos/:id/servicos
 * @desc    Cria um novo serviço
 * @access  Private (Estabelecimento)
 */
router.post('/:id/servicos', authenticate, isEstabelecimento, createServico);

/**
 * @route   GET /estabelecimentos/:id/servicos
 * @desc    Lista serviços do estabelecimento
 * @access  Public
 */
router.get('/:id/servicos', getServicos);

/**
 * @route   PUT /estabelecimentos/:id/servicos/:servicoId
 * @desc    Atualiza um serviço
 * @access  Private (Estabelecimento)
 */
router.put('/:id/servicos/:servicoId', authenticate, isEstabelecimento, updateServico);

/**
 * @route   DELETE /estabelecimentos/:id/servicos/:servicoId
 * @desc    Desativa um serviço
 * @access  Private (Estabelecimento)
 */
router.delete('/:id/servicos/:servicoId', authenticate, isEstabelecimento, deleteServico);

/**
 * @route   POST /estabelecimentos/:id/horarios
 * @desc    Define horário de funcionamento
 * @access  Private (Estabelecimento)
 */
router.post('/:id/horarios', authenticate, isEstabelecimento, createHorario);

export default router;

