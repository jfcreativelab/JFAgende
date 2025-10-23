import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa as rotas
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import estabelecimentoRoutes from './routes/estabelecimentoRoutes.js';
import agendamentoRoutes from './routes/agendamentoRoutes.js';
import avaliacaoRoutes from './routes/avaliacaoRoutes.js';
import favoritoRoutes from './routes/favoritoRoutes.js';
import estatisticasRoutes from './routes/estatisticasRoutes.js';
import agendaRoutes from './routes/agendaRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import planoRoutes from './routes/planoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pagamentoRoutes from './routes/pagamentoRoutes.js';
import setupRoutes from './routes/setupRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Criar pastas necessárias se não existirem
const uploadsDir = path.join(__dirname, '../uploads');
const estabelecimentosDir = path.join(uploadsDir, 'estabelecimentos');
const portfolioDir = path.join(uploadsDir, 'portfolio');
const comprovantesDir = path.join(uploadsDir, 'comprovantes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta uploads criada');
}

if (!fs.existsSync(estabelecimentosDir)) {
  fs.mkdirSync(estabelecimentosDir, { recursive: true });
  console.log('📁 Pasta uploads/estabelecimentos criada');
}

if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
  console.log('📁 Pasta uploads/portfolio criada');
}

if (!fs.existsSync(comprovantesDir)) {
  fs.mkdirSync(comprovantesDir, { recursive: true });
  console.log('📁 Pasta uploads/comprovantes criada');
}

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    message: 'API JFAgende - Sistema de agendamento para estabelecimentos de estética',
    version: '1.0.0',
    status: 'online'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/estabelecimentos', estabelecimentoRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/estatisticas', estatisticasRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/planos', planoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pagamento', pagamentoRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Servir arquivos estáticos (imagens do portfólio) com cache
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '30d', // Cache de 30 dias
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Headers de cache agressivos para imagens
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 dias
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Middleware de tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Servidor JFAgende rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Ouvindo em: 0.0.0.0 (aceita conexões externas)`);
  console.log(`\n🔗 API disponível em:`);
  console.log(`   - Local:  http://localhost:${PORT}/api`);
  console.log(`   - Rede:   http://192.168.1.35:${PORT}/api`);
  console.log(`   - Health: http://192.168.1.35:${PORT}`);
  console.log('='.repeat(50) + '\n');
});

export default app;

