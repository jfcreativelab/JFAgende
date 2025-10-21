import { verifyToken } from '../utils/jwt.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Middleware para verificar se é admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const decoded = verifyToken(token)

    // Verificar se o token é de admin
    if (decoded.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' })
    }

    // Buscar admin no banco
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id }
    })

    if (!admin) {
      return res.status(404).json({ error: 'Administrador não encontrado' })
    }

    if (!admin.ativo) {
      return res.status(403).json({ error: 'Administrador inativo' })
    }

    // Atualizar último acesso
    await prisma.admin.update({
      where: { id: admin.id },
      data: { ultimoAcesso: new Date() }
    })

    req.admin = admin
    next()
  } catch (error) {
    console.error('Erro na autenticação de admin:', error)
    return res.status(401).json({ error: 'Token inválido' })
  }
}

// Middleware para verificar se é super admin
const isSuperAdmin = async (req, res, next) => {
  try {
    await isAdmin(req, res, () => {
      if (req.admin.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Apenas super administradores.' })
      }
      next()
    })
  } catch (error) {
    console.error('Erro na verificação de super admin:', error)
    return res.status(403).json({ error: 'Acesso negado' })
  }
}

// Middleware para registrar ação do admin (auditoria)
const logAdminAction = (acao, entidade) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res)

    res.json = async (data) => {
      // Registrar log apenas se a ação foi bem-sucedida
      if (res.statusCode < 400 && req.admin) {
        try {
          await prisma.logAtividade.create({
            data: {
              adminId: req.admin.id,
              acao,
              entidade,
              entidadeId: req.params.id || null,
              detalhes: JSON.stringify({
                body: req.body,
                params: req.params,
                query: req.query
              }),
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.headers['user-agent']
            }
          })
        } catch (error) {
          console.error('Erro ao registrar log:', error)
        }
      }

      return originalJson(data)
    }

    next()
  }
}

export {
  isAdmin,
  isSuperAdmin,
  logAdminAction
}

