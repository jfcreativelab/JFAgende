import express from 'express';
import { registerCliente, registerEstabelecimento, loginCliente, loginEstabelecimento } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /auth/register/cliente
 * @desc    Registra um novo cliente
 * @access  Public
 */
router.post('/register/cliente', registerCliente);

/**
 * @route   POST /auth/register/estabelecimento
 * @desc    Registra um novo estabelecimento
 * @access  Public
 */
router.post('/register/estabelecimento', registerEstabelecimento);

/**
 * @route   POST /auth/login/cliente
 * @desc    Faz login de cliente
 * @access  Public
 */
router.post('/login/cliente', loginCliente);

/**
 * @route   POST /auth/login/estabelecimento
 * @desc    Faz login de estabelecimento
 * @access  Public
 */
router.post('/login/estabelecimento', loginEstabelecimento);

export default router;

