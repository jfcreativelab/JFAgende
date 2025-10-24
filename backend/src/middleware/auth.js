import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido e adiciona os dados do usuário na requisição
 */
export const authenticate = (req, res, next) => {
  try {
    console.log('🔐 Middleware authenticate chamado para:', {
      url: req.url,
      method: req.method,
      hasAuthHeader: !!req.headers.authorization,
      userAgent: req.headers['user-agent']
    });

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('❌ Token não fornecido para:', req.url);
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = verifyToken(token);
    req.user = decoded; // { id, tipo: 'cliente' | 'estabelecimento' }

    console.log('✅ Token válido para usuário:', decoded);
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

/**
 * Middleware para verificar se o usuário é um cliente
 */
export const isCliente = (req, res, next) => {
  console.log('👤 Middleware isCliente chamado para:', {
    url: req.url,
    userTipo: req.user?.tipo,
    userId: req.user?.id
  });

  if (req.user.tipo !== 'cliente') {
    console.log('❌ Acesso negado - não é cliente:', req.user?.tipo);
    return res.status(403).json({ error: 'Acesso negado. Apenas clientes.' });
  }
  
  console.log('✅ Cliente autorizado');
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

