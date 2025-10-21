import express from 'express';
import { authenticate, isCliente } from '../middleware/auth.js';
import {
  getClienteById,
  updateCliente,
  getClienteAgendamentos
} from '../controllers/clienteController.js';

const router = express.Router();

/**
 * @route   GET /clientes/:id
 * @desc    Obtém dados do cliente
 * @access  Private (Cliente)
 */
router.get('/:id', authenticate, isCliente, getClienteById);

/**
 * @route   PUT /clientes/:id
 * @desc    Atualiza dados do cliente
 * @access  Private (Cliente)
 */
router.put('/:id', authenticate, isCliente, updateCliente);

/**
 * @route   GET /clientes/:id/agendamentos
 * @desc    Lista agendamentos do cliente
 * @access  Private (Cliente)
 */
router.get('/:id/agendamentos', authenticate, isCliente, getClienteAgendamentos);

export default router;

