import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido e adiciona os dados do usuário na requisição
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = verifyToken(token);
    req.user = decoded; // { id, tipo: 'cliente' | 'estabelecimento' }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

/**
 * Middleware para verificar se o usuário é um cliente
 */
export const isCliente = (req, res, next) => {
  if (req.user.tipo !== 'cliente') {
    return res.status(403).json({ error: 'Acesso negado. Apenas clientes.' });
  }
  next();
};

/**
 * Middleware para verificar se o usuário é um estabelecimento
 */
export const isEstabelecimento = (req, res, next) => {
  if (req.user.tipo !== 'estabelecimento') {
    return res.status(403).json({ error: 'Acesso negado. Apenas estabelecimentos.' });
  }
  next();
};

