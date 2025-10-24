import express from 'express';
import { authenticate, isCliente, isEstabelecimento } from '../middleware/auth.js';
import {
  createAgendamento,
  getAgendamentosByEstabelecimento,
  updateAgendamento,
  cancelAgendamento,
  getHorariosDisponiveis
} from '../controllers/agendamentoController.js';

const router = express.Router();

/**
 * @route   POST /agendamentos
 * @desc    Cria um novo agendamento
 * @access  Private (Cliente)
 */
router.post('/', authenticate, isCliente, createAgendamento);

/**
 * @route   GET /agendamentos/estabelecimento/:id
 * @desc    Lista agendamentos de um estabelecimento
 * @access  Private (Estabelecimento)
 */
router.get('/estabelecimento/:id', authenticate, isEstabelecimento, getAgendamentosByEstabelecimento);

/**
 * @route   GET /agendamentos/horarios-disponiveis
 * @desc    Busca horários disponíveis
 * @access  Private (Cliente)
 */
router.get('/horarios-disponiveis', authenticate, isCliente, getHorariosDisponiveis);

/**
 * @route   PUT /agendamentos/:id
 * @desc    Atualiza status do agendamento
 * @access  Private (Cliente ou Estabelecimento)
 */
router.put('/:id', authenticate, updateAgendamento);

/**
 * @route   DELETE /agendamentos/:id
 * @desc    Cancela um agendamento
 * @access  Private (Cliente ou Estabelecimento)
 */
router.delete('/:id', authenticate, cancelAgendamento);

export default router;

