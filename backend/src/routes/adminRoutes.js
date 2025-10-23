import express from 'express'
import * as adminAuthController from '../controllers/adminAuthController.js'
import * as adminController from '../controllers/adminController.js'
import { isAdmin, isSuperAdmin, logAdminAction } from '../middleware/adminAuth.js'

const router = express.Router()

// =====================================================
// ROTAS DE AUTENTICAÇÃO (públicas)
// =====================================================

router.post('/auth/login', adminAuthController.login)
router.post('/auth/setup', adminAuthController.createFirstAdmin) // Apenas para criar primeiro admin

// =====================================================
// ROTAS PROTEGIDAS (Requerem autenticação de admin)
// =====================================================

// Perfil do admin
router.get('/auth/profile', isAdmin, adminAuthController.getProfile)

// Dashboard e Estatísticas
router.get('/dashboard/stats', isAdmin, adminController.getDashboardStats)
router.get('/estatisticas-gerais', isAdmin, adminController.getEstatisticasGerais)
router.get('/atividade-recente', isAdmin, adminController.getAtividadeRecente)

// Gerenciamento de Clientes
router.get('/clientes', isAdmin, adminController.getAllClientes)
router.delete(
  '/clientes/:id',
  isAdmin,
  logAdminAction('DELETE_CLIENTE', 'Cliente'),
  adminController.deleteCliente
)

// Gerenciamento de Estabelecimentos
router.get('/estabelecimentos', isAdmin, adminController.getAllEstabelecimentos)
router.patch(
  '/estabelecimentos/:id/aprovar',
  isAdmin,
  logAdminAction('APPROVE_ESTABELECIMENTO', 'Estabelecimento'),
  adminController.aprovarEstabelecimento
)
router.patch(
  '/estabelecimentos/:id/rejeitar',
  isAdmin,
  logAdminAction('REJECT_ESTABELECIMENTO', 'Estabelecimento'),
  adminController.rejeitarEstabelecimento
)
router.delete(
  '/estabelecimentos/:id',
  isAdmin,
  logAdminAction('DELETE_ESTABELECIMENTO', 'Estabelecimento'),
  adminController.deleteEstabelecimento
)

// Gerenciamento de Assinaturas e Planos
router.get('/assinaturas', isAdmin, adminController.getAllAssinaturas)
router.put(
  '/assinaturas/:estabelecimentoId/plano',
  isAdmin,
  logAdminAction('CHANGE_PLAN', 'Assinatura'),
  adminController.mudarPlanoEstabelecimento
)
router.post(
  '/assinaturas/:estabelecimentoId/cancelar',
  isAdmin,
  logAdminAction('CANCEL_SUBSCRIPTION', 'Assinatura'),
  adminController.cancelarAssinatura
)

// Logs e Auditoria
router.get('/logs', isAdmin, adminController.getLogs)
router.delete(
  '/logs/cleanup',
  isAdmin,
  logAdminAction('CLEANUP_LOGS', 'LogAtividade'),
  adminController.cleanOldLogs
)

// Relatórios Avançados
router.get('/relatorios-avancados', isAdmin, adminController.getRelatoriosAvancados)

// Estatísticas específicas
router.get('/estatisticas-estabelecimentos', isAdmin, adminController.getEstatisticasEstabelecimentos)
router.get('/estatisticas-logs', isAdmin, adminController.getEstatisticasLogs)

// Exportação
router.post('/exportar-estabelecimentos', isAdmin, adminController.exportarEstabelecimentos)
router.post('/exportar-relatorio', isAdmin, adminController.exportarRelatorio)
router.post('/exportar-logs', isAdmin, adminController.exportarLogs)

// =====================================================
// ROTAS DE SUPER ADMIN (Gerenciamento de Admins)
// =====================================================

router.get('/admins', isSuperAdmin, adminController.getAllAdmins)
router.post(
  '/admins',
  isSuperAdmin,
  logAdminAction('CREATE_ADMIN', 'Admin'),
  adminController.createAdmin
)
router.patch(
  '/admins/:id/toggle',
  isSuperAdmin,
  logAdminAction('TOGGLE_ADMIN_STATUS', 'Admin'),
  adminController.toggleAdminStatus
)
router.delete(
  '/admins/:id',
  isSuperAdmin,
  logAdminAction('DELETE_ADMIN', 'Admin'),
  adminController.deleteAdmin
)

export default router

