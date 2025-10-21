import express from 'express';
import { authenticate, isEstabelecimento } from '../middleware/auth.js';
import {
  listarPlanos,
  obterAssinaturaAtual,
  fazerUpgrade,
  cancelarAssinatura,
  verificarDestaque,
  listarDestaques,
  compararPlanos,
  ativarDestaque,
  criarPlano,
  deletarPlano
} from '../controllers/planoController.js';

const router = express.Router();

/**
 * @route   GET /planos
 * @desc    Listar todos os planos disponíveis
 * @access  Public
 */
router.get('/', listarPlanos);

/**
 * @route   POST /planos
 * @desc    Criar novo plano (apenas para setup)
 * @access  Public (apenas para setup inicial)
 */
router.post('/', criarPlano);

/**
 * @route   DELETE /planos/:id
 * @desc    Deletar plano (apenas para setup)
 * @access  Public (apenas para setup inicial)
 */
router.delete('/:id', deletarPlano);

/**
 * @route   GET /planos/comparar
 * @desc    Comparação de planos para página de pricing
 * @access  Public
 */
router.get('/comparar', compararPlanos);

/**
 * @route   GET /planos/destaques
 * @desc    Listar estabelecimentos em destaque
 * @access  Public
 */
router.get('/destaques', listarDestaques);

/**
 * @route   GET /planos/assinatura
 * @desc    Obter assinatura atual do estabelecimento
 * @access  Private (Estabelecimento)
 */
router.get('/assinatura', authenticate, isEstabelecimento, obterAssinaturaAtual);

/**
 * @route   POST /planos/upgrade
 * @desc    Fazer upgrade de plano
 * @access  Private (Estabelecimento)
 */
router.post('/upgrade', authenticate, isEstabelecimento, fazerUpgrade);

/**
 * @route   POST /planos/cancelar
 * @desc    Cancelar assinatura (downgrade para FREE)
 * @access  Private (Estabelecimento)
 */
router.post('/cancelar', authenticate, isEstabelecimento, cancelarAssinatura);

/**
 * @route   GET /planos/destaque/:estabelecimentoId
 * @desc    Verificar se estabelecimento está em destaque
 * @access  Public
 */
router.get('/destaque/:estabelecimentoId', verificarDestaque);

/**
 * @route   POST /planos/destaque/:estabelecimentoId
 * @desc    Ativar destaque manual (admin/futuro)
 * @access  Private (Admin - por enquanto estabelecimento)
 */
router.post('/destaque/:estabelecimentoId', authenticate, isEstabelecimento, ativarDestaque);

export default router;

