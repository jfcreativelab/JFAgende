import express from 'express';
import { authenticate, isCliente } from '../middleware/auth.js';
import {
  addFavorito,
  removeFavorito,
  getFavoritos,
  isFavorito
} from '../controllers/favoritoController.js';

const router = express.Router();

/**
 * @route   POST /favoritos
 * @desc    Adicionar aos favoritos
 * @access  Private (Cliente)
 */
router.post('/', authenticate, isCliente, addFavorito);

/**
 * @route   DELETE /favoritos/:estabelecimentoId
 * @desc    Remover dos favoritos
 * @access  Private (Cliente)
 */
router.delete('/:estabelecimentoId', authenticate, isCliente, removeFavorito);

/**
 * @route   GET /favoritos
 * @desc    Listar favoritos
 * @access  Private (Cliente)
 */
router.get('/', authenticate, isCliente, getFavoritos);

/**
 * @route   GET /favoritos/check/:estabelecimentoId
 * @desc    Verificar se está nos favoritos
 * @access  Private (Cliente)
 */
router.get('/check/:estabelecimentoId', authenticate, isCliente, isFavorito);

export default router;


