import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'

const prisma = new PrismaClient()

// Login de admin
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    // Buscar admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    if (!admin.ativo) {
      return res.status(403).json({ error: 'Administrador inativo' })
    }

    // Verificar senha
    const senhaValida = await comparePassword(senha, admin.senhaHash)

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Gerar token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      tipo: 'admin',
      role: admin.role
    })

    // Atualizar último acesso
    await prisma.admin.update({
      where: { id: admin.id },
      data: { ultimoAcesso: new Date() }
    })

    // Registrar log
    await prisma.logAtividade.create({
      data: {
        adminId: admin.id,
        acao: 'LOGIN',
        entidade: 'Admin',
        entidadeId: admin.id,
        detalhes: JSON.stringify({ email }),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    })

    res.json({
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar
      }
    })
  } catch (error) {
    console.error('Erro no login de admin:', error)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

// Criar primeiro admin (apenas para setup inicial)
export const createFirstAdmin = async (req, res) => {
  try {
    // Verificar se já existe algum admin
    const adminCount = await prisma.admin.count()

    if (adminCount > 0) {
      return res.status(403).json({ error: 'Já existem administradores no sistema' })
    }

    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
    }

    // Criar hash da senha
    const senhaHash = await hashPassword(senha)

    // Criar admin
    const admin = await prisma.admin.create({
      data: {
        nome,
        email,
        senhaHash,
        role: 'SUPER_ADMIN'
      }
    })

    res.status(201).json({
      message: 'Primeiro administrador criado com sucesso',
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Erro ao criar primeiro admin:', error)
    res.status(500).json({ error: 'Erro ao criar administrador' })
  }
}

// Obter perfil do admin logado
export const getProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        avatar: true,
        ativo: true,
        ultimoAcesso: true,
        criadoEm: true
      }
    })

    res.json(admin)
  } catch (error) {
    console.error('Erro ao obter perfil:', error)
    res.status(500).json({ error: 'Erro ao obter perfil' })
  }
}

