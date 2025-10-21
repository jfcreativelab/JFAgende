import express from 'express';
import { authenticate, isCliente } from '../middleware/auth.js';
import {
  createAvaliacao,
  getAvaliacoesByEstabelecimento,
  updateAvaliacao,
  deleteAvaliacao
} from '../controllers/avaliacaoController.js';

const router = express.Router();

/**
 * @route   POST /avaliacoes
 * @desc    Criar avaliação
 * @access  Private (Cliente)
 */
router.post('/', authenticate, isCliente, createAvaliacao);

/**
 * @route   GET /avaliacoes/estabelecimento/:id
 * @desc    Listar avaliações de um estabelecimento
 * @access  Public
 */
router.get('/estabelecimento/:id', getAvaliacoesByEstabelecimento);

/**
 * @route   PUT /avaliacoes/:id
 * @desc    Atualizar avaliação
 * @access  Private (Cliente)
 */
router.put('/:id', authenticate, isCliente, updateAvaliacao);

/**
 * @route   DELETE /avaliacoes/:id
 * @desc    Deletar avaliação
 * @access  Private (Cliente)
 */
router.delete('/:id', authenticate, isCliente, deleteAvaliacao);

export default router;


