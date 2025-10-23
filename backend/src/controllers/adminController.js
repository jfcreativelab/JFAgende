import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../utils/password.js'

const prisma = new PrismaClient()

// =====================================================
// DASHBOARD & ESTATÍSTICAS
// =====================================================

// Estatísticas gerais para o dashboard
export const getEstatisticasGerais = async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalEstabelecimentos,
      totalAgendamentos,
      receitaTotal
    ] = await Promise.all([
      prisma.cliente.count().catch(() => 0),
      prisma.estabelecimento.count().catch(() => 0),
      prisma.agendamento.count().catch(() => 0),
      prisma.agendamento.aggregate({
        where: { status: 'CONCLUIDO' },
        _sum: { valorTotal: true }
      }).then(result => result._sum.valorTotal || 0).catch(() => 0)
    ])

    // Calcular crescimento mensal
    const mesAtual = new Date()
    mesAtual.setDate(1)
    mesAtual.setHours(0, 0, 0, 0)

    const mesPassado = new Date(mesAtual)
    mesPassado.setMonth(mesPassado.getMonth() - 1)

    const [
      usuariosMesAtual,
      usuariosMesPassado,
      estabelecimentosMesAtual,
      estabelecimentosMesPassado,
      agendamentosMesAtual,
      agendamentosMesPassado
    ] = await Promise.all([
      prisma.cliente.count({
        where: { criadoEm: { gte: mesAtual } }
      }).catch(() => 0),
      prisma.cliente.count({
        where: {
          criadoEm: {
            gte: mesPassado,
            lt: mesAtual
          }
        }
      }).catch(() => 0),
      prisma.estabelecimento.count({
        where: { criadoEm: { gte: mesAtual } }
      }).catch(() => 0),
      prisma.estabelecimento.count({
        where: {
          criadoEm: {
            gte: mesPassado,
            lt: mesAtual
          }
        }
      }).catch(() => 0),
      prisma.agendamento.count({
        where: { criadoEm: { gte: mesAtual } }
      }).catch(() => 0),
      prisma.agendamento.count({
        where: {
          criadoEm: {
            gte: mesPassado,
            lt: mesAtual
          }
        }
      }).catch(() => 0)
    ])

    const crescimentoUsuarios = usuariosMesPassado > 0
      ? ((usuariosMesAtual - usuariosMesPassado) / usuariosMesPassado * 100).toFixed(1)
      : 0

    const crescimentoEstabelecimentos = estabelecimentosMesPassado > 0
      ? ((estabelecimentosMesAtual - estabelecimentosMesPassado) / estabelecimentosMesPassado * 100).toFixed(1)
      : 0

    const crescimentoAgendamentos = agendamentosMesPassado > 0
      ? ((agendamentosMesAtual - agendamentosMesPassado) / agendamentosMesPassado * 100).toFixed(1)
      : 0

    const crescimentoReceita = 15.2 // Simulado por enquanto

    res.json({
      totalUsuarios,
      totalEstabelecimentos,
      totalAgendamentos,
      receitaTotal,
      crescimentoUsuarios: parseFloat(crescimentoUsuarios),
      crescimentoEstabelecimentos: parseFloat(crescimentoEstabelecimentos),
      crescimentoAgendamentos: parseFloat(crescimentoAgendamentos),
      crescimentoReceita: parseFloat(crescimentoReceita)
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas gerais:', error)
    res.status(500).json({ error: 'Erro ao obter estatísticas gerais' })
  }
}

// Atividade recente para o dashboard
export const getAtividadeRecente = async (req, res) => {
  try {
    const atividades = []

    // Últimos clientes cadastrados
    const ultimosClientes = await prisma.cliente.findMany({
      take: 3,
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true
      }
    })

    ultimosClientes.forEach(cliente => {
      atividades.push({
        id: `cliente-${cliente.id}`,
        tipo: 'cliente',
        acao: 'CADASTRO',
        descricao: `${cliente.nome} se cadastrou`,
        data: cliente.criadoEm,
        usuario: cliente.nome
      })
    })

    // Últimos estabelecimentos cadastrados
    const ultimosEstabelecimentos = await prisma.estabelecimento.findMany({
      take: 3,
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        categoria: true,
        criadoEm: true
      }
    })

    ultimosEstabelecimentos.forEach(estabelecimento => {
      atividades.push({
        id: `estabelecimento-${estabelecimento.id}`,
        tipo: 'estabelecimento',
        acao: 'CADASTRO',
        descricao: `${estabelecimento.nome} (${estabelecimento.categoria}) se cadastrou`,
        data: estabelecimento.criadoEm,
        usuario: estabelecimento.nome
      })
    })

    // Últimos agendamentos
    const ultimosAgendamentos = await prisma.agendamento.findMany({
      take: 3,
      orderBy: { criadoEm: 'desc' },
      include: {
        cliente: { select: { nome: true } },
        estabelecimento: { select: { nome: true } },
        servico: { select: { nome: true } }
      }
    })

    ultimosAgendamentos.forEach(agendamento => {
      atividades.push({
        id: `agendamento-${agendamento.id}`,
        tipo: 'agendamento',
        acao: 'CRIACAO',
        descricao: `${agendamento.cliente.nome} agendou ${agendamento.servico.nome} em ${agendamento.estabelecimento.nome}`,
        data: agendamento.criadoEm,
        usuario: agendamento.cliente.nome
      })
    })

    // Ordenar por data e pegar as 10 mais recentes
    const atividadesOrdenadas = atividades
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 10)

    res.json({ atividades: atividadesOrdenadas })
  } catch (error) {
    console.error('Erro ao obter atividade recente:', error)
    res.status(500).json({ error: 'Erro ao obter atividade recente' })
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalClientes,
      totalEstabelecimentos,
      totalAgendamentos,
      totalAvaliacoes,
      agendamentosHoje
    ] = await Promise.all([
      prisma.cliente.count().catch(() => 0),
      prisma.estabelecimento.count().catch(() => 0),
      prisma.agendamento.count().catch(() => 0),
      prisma.avaliacao.count().catch(() => 0),
      prisma.agendamento.count({
        where: {
          dataHora: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }).catch(() => 0)
    ])

    // Calcular receita estimada
    const assinaturas = await prisma.assinatura.findMany({
      where: { ativo: true },
      include: { plano: true }
    }).catch(() => [])
    const receitaEstimada = assinaturas.reduce((sum, ass) => sum + (ass.plano?.preco || 0), 0)

    // Estatísticas de planos
    const estatisticasPlanos = await prisma.assinatura.groupBy({
      by: ['planoId'],
      _count: true,
      where: { ativo: true }
    }).catch(() => [])

    const planosComNomes = await Promise.all(
      estatisticasPlanos.map(async (stat) => {
        const plano = await prisma.plano.findUnique({ where: { id: stat.planoId } }).catch(() => null)
        return {
          plano: plano?.nome || 'UNKNOWN',
          quantidade: stat._count
        }
      })
    )

    // Agendamentos por status
    const agendamentosPorStatus = await prisma.agendamento.groupBy({
      by: ['status'],
      _count: true
    }).catch(() => [])

    // Novos usuários nos últimos 7 dias
    const seteDiasAtras = new Date()
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

    const novosClientes = await prisma.cliente.count({
      where: { criadoEm: { gte: seteDiasAtras } }
    }).catch(() => 0)

    const novosEstabelecimentos = await prisma.estabelecimento.count({
      where: { criadoEm: { gte: seteDiasAtras } }
    }).catch(() => 0)

    // Crescimento mensal
    const mesAtual = new Date()
    mesAtual.setDate(1)
    mesAtual.setHours(0, 0, 0, 0)

    const mesPassado = new Date(mesAtual)
    mesPassado.setMonth(mesPassado.getMonth() - 1)

    const agendamentosMesAtual = await prisma.agendamento.count({
      where: { criadoEm: { gte: mesAtual } }
    }).catch(() => 0)

    const agendamentosMesPassado = await prisma.agendamento.count({
      where: {
        criadoEm: {
          gte: mesPassado,
          lt: mesAtual
        }
      }
    }).catch(() => 0)

    const crescimentoAgendamentos = agendamentosMesPassado > 0
      ? ((agendamentosMesAtual - agendamentosMesPassado) / agendamentosMesPassado * 100).toFixed(1)
      : 0

    res.json({
      resumo: {
        totalClientes,
        totalEstabelecimentos,
        totalAgendamentos,
        totalAvaliacoes,
        agendamentosHoje,
        receitaEstimadaMensal: receitaEstimada.toFixed(2),
        novosClientes7Dias: novosClientes,
        novosEstabelecimentos7Dias: novosEstabelecimentos,
        crescimentoAgendamentos: parseFloat(crescimentoAgendamentos)
      },
      distribuicaoPlanos: planosComNomes,
      agendamentosPorStatus,
      agendamentosMesAtual,
      agendamentosMesPassado
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    res.status(500).json({ error: 'Erro ao obter estatísticas' })
  }
}

// =====================================================
// GERENCIAMENTO DE USUÁRIOS
// =====================================================

// Listar todos os clientes
export const getAllClientes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', orderBy = 'criadoEm', order = 'desc' } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [orderBy]: order },
        include: {
          _count: {
            select: {
              agendamentos: true,
              avaliacoes: true,
              favoritos: true
            }
          }
        }
      }),
      prisma.cliente.count({ where })
    ])

    res.json({
      clientes: clientes.map(c => ({
        ...c,
        senhaHash: undefined,
        totalAgendamentos: c._count.agendamentos,
        totalAvaliacoes: c._count.avaliacoes,
        totalFavoritos: c._count.favoritos
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
    res.status(500).json({ error: 'Erro ao listar clientes' })
  }
}

// Listar todos os estabelecimentos
export const getAllEstabelecimentos = async (req, res) => {
  try {
    console.log('[ADMIN] Iniciando getAllEstabelecimentos...')
    const { page = 1, limit = 20, search = '', orderBy = 'criadoEm', order = 'desc' } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { categoria: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    console.log('[ADMIN] Buscando estabelecimentos com where:', where)

    const [estabelecimentos, total] = await Promise.all([
      prisma.estabelecimento.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [orderBy]: order },
        include: {
          _count: {
            select: {
              agendamentos: true,
              servicos: true,
              avaliacoes: true
            }
          },
          assinatura: {
            include: { plano: true }
          }
        }
      }),
      prisma.estabelecimento.count({ where })
    ])

    console.log(`[ADMIN] Encontrados ${estabelecimentos.length} estabelecimentos`)

    res.json({
      estabelecimentos: estabelecimentos.map(e => ({
        ...e,
        senhaHash: undefined,
        totalAgendamentos: e._count.agendamentos,
        totalServicos: e._count.servicos,
        totalAvaliacoes: e._count.avaliacoes,
        plano: e.assinatura?.plano?.nome || 'FREE'
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('[ADMIN] ❌ ERRO DETALHADO ao listar estabelecimentos:', error)
    console.error('[ADMIN] Stack trace:', error.stack)
    console.error('[ADMIN] Mensagem:', error.message)
    res.status(500).json({ error: 'Erro ao listar estabelecimentos', details: error.message })
  }
}

// Deletar cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.cliente.delete({
      where: { id }
    })

    res.json({ message: 'Cliente deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    res.status(500).json({ error: 'Erro ao deletar cliente' })
  }
}

// Aprovar estabelecimento
export const aprovarEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params

    const estabelecimento = await prisma.estabelecimento.update({
      where: { id },
      data: { ativo: true }
    })

    res.json({ 
      message: 'Estabelecimento aprovado com sucesso',
      estabelecimento 
    })
  } catch (error) {
    console.error('Erro ao aprovar estabelecimento:', error)
    res.status(500).json({ error: 'Erro ao aprovar estabelecimento' })
  }
}

// Rejeitar estabelecimento
export const rejeitarEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params

    const estabelecimento = await prisma.estabelecimento.update({
      where: { id },
      data: { ativo: false }
    })

    res.json({ 
      message: 'Estabelecimento rejeitado',
      estabelecimento 
    })
  } catch (error) {
    console.error('Erro ao rejeitar estabelecimento:', error)
    res.status(500).json({ error: 'Erro ao rejeitar estabelecimento' })
  }
}

// Deletar estabelecimento
export const deleteEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.estabelecimento.delete({
      where: { id }
    })

    res.json({ message: 'Estabelecimento deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar estabelecimento:', error)
    res.status(500).json({ error: 'Erro ao deletar estabelecimento' })
  }
}

// =====================================================
// GERENCIAMENTO DE PLANOS E ASSINATURAS
// =====================================================

// Listar todas as assinaturas
export const getAllAssinaturas = async (req, res) => {
  try {
    console.log('[ADMIN] Iniciando getAllAssinaturas...')
    const { page = 1, limit = 20, planoId = '', ativo = '' } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (planoId) where.planoId = planoId
    if (ativo !== '') where.ativo = ativo === 'true'

    console.log('[ADMIN] Filtros aplicados:', where)

    const [assinaturas, total] = await Promise.all([
      prisma.assinatura.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { criadoEm: 'desc' },
        include: {
          plano: true,
          estabelecimento: {
            select: {
              id: true,
              nome: true,
              email: true,
              categoria: true
            }
          }
        }
      }),
      prisma.assinatura.count({ where })
    ])

    console.log(`[ADMIN] Encontradas ${assinaturas.length} assinaturas`)

    res.json({
      assinaturas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('[ADMIN] ❌ ERRO DETALHADO ao listar assinaturas:', error)
    console.error('[ADMIN] Stack trace:', error.stack)
    console.error('[ADMIN] Mensagem:', error.message)
    res.status(500).json({ error: 'Erro ao listar assinaturas', details: error.message })
  }
}

// Mudar plano de um estabelecimento (forçado pelo admin)
export const mudarPlanoEstabelecimento = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params
    const { planoId } = req.body

    // Verificar se o plano existe
    const plano = await prisma.plano.findUnique({
      where: { id: planoId }
    })

    if (!plano) {
      return res.status(404).json({ error: 'Plano não encontrado' })
    }

    // Buscar ou criar assinatura
    let assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId }
    })

    const agora = new Date()
    const dataFim = new Date(agora)
    dataFim.setMonth(dataFim.getMonth() + 1)

    if (assinatura) {
      // Atualizar assinatura existente
      assinatura = await prisma.assinatura.update({
        where: { estabelecimentoId },
        data: {
          planoId,
          ativo: true,
          dataInicio: agora,
          dataFim: plano.nome === 'FREE' ? null : dataFim,
          destaqueAte: plano.diasDestaque > 0 ? new Date(agora.getTime() + plano.diasDestaque * 24 * 60 * 60 * 1000) : null
        },
        include: { plano: true }
      })
    } else {
      // Criar nova assinatura
      assinatura = await prisma.assinatura.create({
        data: {
          estabelecimentoId,
          planoId,
          ativo: true,
          dataInicio: agora,
          dataFim: plano.nome === 'FREE' ? null : dataFim,
          destaqueAte: plano.diasDestaque > 0 ? new Date(agora.getTime() + plano.diasDestaque * 24 * 60 * 60 * 1000) : null
        },
        include: { plano: true }
      })
    }

    res.json({
      message: 'Plano atualizado com sucesso',
      assinatura
    })
  } catch (error) {
    console.error('Erro ao mudar plano:', error)
    res.status(500).json({ error: 'Erro ao mudar plano' })
  }
}

// Cancelar assinatura de um estabelecimento
export const cancelarAssinatura = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params

    // Buscar plano FREE
    const planoFree = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    })

    if (!planoFree) {
      return res.status(404).json({ error: 'Plano FREE não encontrado' })
    }

    // Downgrade para FREE
    const assinatura = await prisma.assinatura.update({
      where: { estabelecimentoId },
      data: {
        planoId: planoFree.id,
        ativo: true,
        dataFim: null,
        destaqueAte: null
      },
      include: { plano: true }
    })

    res.json({
      message: 'Assinatura cancelada. Estabelecimento movido para plano FREE',
      assinatura
    })
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error)
    res.status(500).json({ error: 'Erro ao cancelar assinatura' })
  }
}

// =====================================================
// LOGS E AUDITORIA
// =====================================================

// Listar logs de atividade
export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, acao = '', entidade = '', adminId = '' } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (acao) where.acao = acao
    if (entidade) where.entidade = entidade
    if (adminId) where.adminId = adminId

    const [logs, total] = await Promise.all([
      prisma.logAtividade.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { criadoEm: 'desc' },
        include: {
          admin: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      }),
      prisma.logAtividade.count({ where })
    ])

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Erro ao listar logs:', error)
    res.status(500).json({ error: 'Erro ao listar logs' })
  }
}

// Limpar logs antigos (mais de 90 dias)
export const cleanOldLogs = async (req, res) => {
  try {
    const noventaDiasAtras = new Date()
    noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90)

    const resultado = await prisma.logAtividade.deleteMany({
      where: {
        criadoEm: {
          lt: noventaDiasAtras
        }
      }
    })

    res.json({
      message: 'Logs antigos removidos com sucesso',
      totalRemovido: resultado.count
    })
  } catch (error) {
    console.error('Erro ao limpar logs:', error)
    res.status(500).json({ error: 'Erro ao limpar logs' })
  }
}

// =====================================================
// GERENCIAMENTO DE ADMINS (Apenas SUPER_ADMIN)
// =====================================================

// Listar todos os admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        avatar: true,
        ativo: true,
        ultimoAcesso: true,
        criadoEm: true
      },
      orderBy: { criadoEm: 'desc' }
    })

    res.json(admins)
  } catch (error) {
    console.error('Erro ao listar admins:', error)
    res.status(500).json({ error: 'Erro ao listar admins' })
  }
}

// Criar novo admin (apenas SUPER_ADMIN)
export const createAdmin = async (req, res) => {
  try {
    const { nome, email, senha, role = 'ADMIN' } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
    }

    // Verificar se email já existe
    const adminExistente = await prisma.admin.findUnique({
      where: { email }
    })

    if (adminExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    // Criar hash da senha
    const senhaHash = await hashPassword(senha)

    // Criar admin
    const admin = await prisma.admin.create({
      data: {
        nome,
        email,
        senhaHash,
        role
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true
      }
    })

    res.status(201).json(admin)
  } catch (error) {
    console.error('Erro ao criar admin:', error)
    res.status(500).json({ error: 'Erro ao criar admin' })
  }
}

// Desativar/Ativar admin
export const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params

    const admin = await prisma.admin.findUnique({
      where: { id }
    })

    if (!admin) {
      return res.status(404).json({ error: 'Admin não encontrado' })
    }

    const adminAtualizado = await prisma.admin.update({
      where: { id },
      data: { ativo: !admin.ativo },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true
      }
    })

    res.json(adminAtualizado)
  } catch (error) {
    console.error('Erro ao alterar status do admin:', error)
    res.status(500).json({ error: 'Erro ao alterar status' })
  }
}

// Deletar admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params

    // Não permitir deletar a si mesmo
    if (id === req.admin.id) {
      return res.status(400).json({ error: 'Você não pode deletar sua própria conta' })
    }

    await prisma.admin.delete({
      where: { id }
    })

    res.json({ message: 'Admin deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar admin:', error)
    res.status(500).json({ error: 'Erro ao deletar admin' })
  }
}

// =====================================================
// ESTATÍSTICAS ESPECÍFICAS
// =====================================================

// Estatísticas de usuários
export const getEstatisticasUsuarios = async (req, res) => {
  try {
    const [
      totalUsuarios,
      usuariosAtivos,
      usuariosInativos,
      novosUsuariosHoje,
      novosUsuariosSemana,
      usuariosPorTipo
    ] = await Promise.all([
      prisma.cliente.count().catch(() => 0),
      prisma.cliente.count({ where: { ativo: true } }).catch(() => 0),
      prisma.cliente.count({ where: { ativo: false } }).catch(() => 0),
      prisma.cliente.count({
        where: {
          criadoEm: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }).catch(() => 0),
      prisma.cliente.count({
        where: {
          criadoEm: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }).catch(() => 0),
      prisma.cliente.groupBy({
        by: ['tipo'],
        _count: true
      }).catch(() => [])
    ])

    // Calcular crescimento mensal
    const mesAtual = new Date()
    mesAtual.setDate(1)
    mesAtual.setHours(0, 0, 0, 0)

    const mesPassado = new Date(mesAtual)
    mesPassado.setMonth(mesPassado.getMonth() - 1)

    const [usuariosMesAtual, usuariosMesPassado] = await Promise.all([
      prisma.cliente.count({
        where: { criadoEm: { gte: mesAtual } }
      }).catch(() => 0),
      prisma.cliente.count({
        where: {
          criadoEm: {
            gte: mesPassado,
            lt: mesAtual
          }
        }
      }).catch(() => 0)
    ])

    const crescimentoUsuarios = usuariosMesPassado > 0
      ? ((usuariosMesAtual - usuariosMesPassado) / usuariosMesPassado * 100).toFixed(1)
      : 0

    // Dados por mês (últimos 6 meses)
    const dadosPorMes = []
    for (let i = 5; i >= 0; i--) {
      const dataMes = new Date()
      dataMes.setMonth(dataMes.getMonth() - i)
      dataMes.setDate(1)
      dataMes.setHours(0, 0, 0, 0)

      const proximoMes = new Date(dataMes)
      proximoMes.setMonth(proximoMes.getMonth() + 1)

      const usuariosMes = await prisma.cliente.count({
        where: {
          criadoEm: {
            gte: dataMes,
            lt: proximoMes
          }
        }
      }).catch(() => 0)

      dadosPorMes.push({
        mes: dataMes.toLocaleDateString('pt-BR', { month: 'short' }),
        usuarios: usuariosMes
      })
    }

    res.json({
      totalUsuarios,
      usuariosAtivos,
      usuariosInativos,
      novosUsuariosHoje,
      novosUsuariosSemana,
      crescimentoUsuarios: parseFloat(crescimentoUsuarios),
      usuariosPorTipo: usuariosPorTipo.map(item => ({
        tipo: item.tipo || 'cliente',
        quantidade: item._count.tipo
      })),
      dadosPorMes
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas de usuários:', error)
    res.status(500).json({ error: 'Erro ao obter estatísticas de usuários' })
  }
}

// Estatísticas de estabelecimentos
export const getEstatisticasEstabelecimentos = async (req, res) => {
  try {
    const [
      totalEstabelecimentos,
      estabelecimentosAtivos,
      estabelecimentosPendentes,
      receitaTotal,
      topCategoria,
      mediaAvaliacao,
      totalAgendamentos
    ] = await Promise.all([
      prisma.estabelecimento.count().catch(() => 0),
      prisma.estabelecimento.count({ where: { ativo: true } }).catch(() => 0),
      prisma.estabelecimento.count({ where: { ativo: false } }).catch(() => 0),
      prisma.agendamento.aggregate({
        where: { status: 'CONCLUIDO' },
        _sum: { valorTotal: true }
      }).then(result => result._sum.valorTotal || 0).catch(() => 0),
      prisma.estabelecimento.groupBy({
        by: ['categoria'],
        _count: true,
        orderBy: { _count: { categoria: 'desc' } },
        take: 1
      }).then(result => result[0]?.categoria || 'N/A').catch(() => 'N/A'),
      prisma.avaliacao.aggregate({
        _avg: { nota: true }
      }).then(result => result._avg.nota || 0).catch(() => 0),
      prisma.agendamento.count().catch(() => 0)
    ])

    // Calcular crescimento
    const mesAtual = new Date()
    mesAtual.setDate(1)
    mesAtual.setHours(0, 0, 0, 0)

    const mesPassado = new Date(mesAtual)
    mesPassado.setMonth(mesPassado.getMonth() - 1)

    const [estabelecimentosMesAtual, estabelecimentosMesPassado] = await Promise.all([
      prisma.estabelecimento.count({
        where: { criadoEm: { gte: mesAtual } }
      }).catch(() => 0),
      prisma.estabelecimento.count({
        where: {
          criadoEm: {
            gte: mesPassado,
            lt: mesAtual
          }
        }
      }).catch(() => 0)
    ])

    const crescimentoEstabelecimentos = estabelecimentosMesPassado > 0
      ? ((estabelecimentosMesAtual - estabelecimentosMesPassado) / estabelecimentosMesPassado * 100).toFixed(1)
      : 0

    res.json({
      totalEstabelecimentos,
      estabelecimentosAtivos,
      estabelecimentosPendentes,
      receitaTotal,
      crescimentoEstabelecimentos: parseFloat(crescimentoEstabelecimentos),
      topCategoria,
      mediaAvaliacao: Math.round(mediaAvaliacao * 10) / 10,
      totalAgendamentos
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas de estabelecimentos:', error)
    res.status(500).json({ error: 'Erro ao obter estatísticas de estabelecimentos' })
  }
}

// Estatísticas de logs
export const getEstatisticasLogs = async (req, res) => {
  try {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const semanaAtras = new Date(hoje)
    semanaAtras.setDate(semanaAtras.getDate() - 7)

    const [
      totalLogs,
      logsHoje,
      logsSemana,
      adminsAtivos,
      acoesMaisComuns,
      entidadesMaisAfetadas,
      logsPorHora,
      taxaErro
    ] = await Promise.all([
      prisma.logAtividade.count().catch(() => 0),
      prisma.logAtividade.count({
        where: {
          criadoEm: {
            gte: hoje,
            lt: amanha
          }
        }
      }).catch(() => 0),
      prisma.logAtividade.count({
        where: {
          criadoEm: {
            gte: semanaAtras
          }
        }
      }).catch(() => 0),
      prisma.admin.count({ where: { ativo: true } }).catch(() => 0),
      prisma.logAtividade.groupBy({
        by: ['acao'],
        _count: true,
        orderBy: { _count: { acao: 'desc' } },
        take: 5
      }).catch(() => []),
      prisma.logAtividade.groupBy({
        by: ['entidade'],
        _count: true,
        orderBy: { _count: { entidade: 'desc' } },
        take: 5
      }).catch(() => []),
      // Simular logs por hora
      Promise.resolve([
        { hora: '00:00', quantidade: 2 },
        { hora: '01:00', quantidade: 1 },
        { hora: '02:00', quantidade: 0 },
        { hora: '03:00', quantidade: 1 },
        { hora: '04:00', quantidade: 0 },
        { hora: '05:00', quantidade: 1 },
        { hora: '06:00', quantidade: 3 },
        { hora: '07:00', quantidade: 5 },
        { hora: '08:00', quantidade: 8 },
        { hora: '09:00', quantidade: 12 },
        { hora: '10:00', quantidade: 15 },
        { hora: '11:00', quantidade: 18 },
        { hora: '12:00', quantidade: 14 },
        { hora: '13:00', quantidade: 16 },
        { hora: '14:00', quantidade: 20 },
        { hora: '15:00', quantidade: 22 },
        { hora: '16:00', quantidade: 19 },
        { hora: '17:00', quantidade: 17 },
        { hora: '18:00', quantidade: 13 },
        { hora: '19:00', quantidade: 9 },
        { hora: '20:00', quantidade: 6 },
        { hora: '21:00', quantidade: 4 },
        { hora: '22:00', quantidade: 3 },
        { hora: '23:00', quantidade: 2 }
      ]),
      // Calcular taxa de erro
      prisma.logAtividade.count({
        where: { status: 'error' }
      }).then(erros => {
        return prisma.logAtividade.count().then(total => {
          return total > 0 ? ((erros / total) * 100).toFixed(1) : 0
        })
      }).catch(() => 0)
    ])

    res.json({
      totalLogs,
      logsHoje,
      logsSemana,
      adminsAtivos,
      acoesMaisComuns: acoesMaisComuns.map(item => ({
        acao: item.acao,
        quantidade: item._count.acao
      })),
      entidadesMaisAfetadas: entidadesMaisAfetadas.map(item => ({
        nome: item.entidade,
        quantidade: item._count.entidade,
        acoes: item._count.entidade
      })),
      logsPorHora,
      taxaErro: parseFloat(taxaErro)
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas de logs:', error)
    res.status(500).json({ error: 'Erro ao obter estatísticas de logs' })
  }
}

// =====================================================
// EXPORTAÇÃO
// =====================================================

// Exportar estabelecimentos
export const exportarEstabelecimentos = async (req, res) => {
  try {
    const { formato = 'csv' } = req.query

    const estabelecimentos = await prisma.estabelecimento.findMany({
      include: {
        _count: {
          select: {
            agendamentos: true,
            servicos: true,
            avaliacoes: true
          }
        },
        assinatura: {
          include: { plano: true }
        }
      }
    })

    if (formato === 'csv') {
      const csvHeader = 'Nome,Email,Categoria,Plano,Agendamentos,Servicos,Avaliacoes,Status,CriadoEm\n'
      const csvData = estabelecimentos.map(e => 
        `"${e.nome}","${e.email}","${e.categoria}","${e.assinatura?.plano?.nome || 'FREE'}","${e._count.agendamentos}","${e._count.servicos}","${e._count.avaliacoes}","${e.ativo ? 'Ativo' : 'Inativo'}","${e.criadoEm.toISOString()}"`
      ).join('\n')

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=estabelecimentos.csv')
      res.send(csvHeader + csvData)
    } else if (formato === 'excel') {
      // Para Excel, retornar JSON que pode ser convertido no frontend
      res.json({
        estabelecimentos: estabelecimentos.map(e => ({
          nome: e.nome,
          email: e.email,
          categoria: e.categoria,
          plano: e.assinatura?.plano?.nome || 'FREE',
          agendamentos: e._count.agendamentos,
          servicos: e._count.servicos,
          avaliacoes: e._count.avaliacoes,
          status: e.ativo ? 'Ativo' : 'Inativo',
          criadoEm: e.criadoEm
        }))
      })
    } else {
      res.status(400).json({ error: 'Formato não suportado' })
    }
  } catch (error) {
    console.error('Erro ao exportar estabelecimentos:', error)
    res.status(500).json({ error: 'Erro ao exportar estabelecimentos' })
  }
}

// Exportar relatório
export const exportarRelatorio = async (req, res) => {
  try {
    const { formato = 'pdf' } = req.body

    // Buscar dados do relatório
    const dados = await getRelatoriosAvancados(req, res)
    
    if (formato === 'pdf') {
      // Para PDF, retornar JSON que pode ser convertido no frontend
      res.json({
        tipo: 'pdf',
        dados: dados,
        geradoEm: new Date().toISOString()
      })
    } else if (formato === 'excel') {
      res.json({
        tipo: 'excel',
        dados: dados,
        geradoEm: new Date().toISOString()
      })
    } else if (formato === 'csv') {
      res.json({
        tipo: 'csv',
        dados: dados,
        geradoEm: new Date().toISOString()
      })
    } else {
      res.status(400).json({ error: 'Formato não suportado' })
    }
  } catch (error) {
    console.error('Erro ao exportar relatório:', error)
    res.status(500).json({ error: 'Erro ao exportar relatório' })
  }
}

// Exportar logs
export const exportarLogs = async (req, res) => {
  try {
    const { formato = 'csv', filtros = {}, selectedLogs = [] } = req.body

    let where = {}
    if (filtros.acao) where.acao = filtros.acao
    if (filtros.entidade) where.entidade = filtros.entidade
    if (filtros.admin) where.adminId = filtros.admin
    if (filtros.dataInicio && filtros.dataFim) {
      where.criadoEm = {
        gte: new Date(filtros.dataInicio),
        lte: new Date(filtros.dataFim)
      }
    }

    const logs = await prisma.logAtividade.findMany({
      where: selectedLogs.length > 0 ? { id: { in: selectedLogs } } : where,
      include: {
        admin: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    })

    if (formato === 'csv') {
      const csvHeader = 'Data,Acao,Entidade,Admin,IP,Status,Detalhes\n'
      const csvData = logs.map(log => 
        `"${log.criadoEm.toISOString()}","${log.acao}","${log.entidade}","${log.admin?.nome || 'Sistema'}","${log.ipAddress || 'N/A'}","${log.status || 'success'}","${log.detalhes || ''}"`
      ).join('\n')

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=logs_auditoria.csv')
      res.send(csvHeader + csvData)
    } else if (formato === 'excel') {
      res.json({
        logs: logs.map(log => ({
          data: log.criadoEm,
          acao: log.acao,
          entidade: log.entidade,
          admin: log.admin?.nome || 'Sistema',
          ip: log.ipAddress || 'N/A',
          status: log.status || 'success',
          detalhes: log.detalhes || ''
        }))
      })
    } else {
      res.status(400).json({ error: 'Formato não suportado' })
    }
  } catch (error) {
    console.error('Erro ao exportar logs:', error)
    res.status(500).json({ error: 'Erro ao exportar logs' })
  }
}

// =====================================================
// RELATÓRIOS AVANÇADOS
// =====================================================

export const getRelatoriosAvancados = async (req, res) => {
  try {
    const { periodo = '30d', tipoRelatorio = 'geral', estabelecimento, plano } = req.query

    // Calcular datas baseado no período
    const agora = new Date()
    let dataInicio = new Date()
    
    switch (periodo) {
      case '7d':
        dataInicio.setDate(agora.getDate() - 7)
        break
      case '30d':
        dataInicio.setDate(agora.getDate() - 30)
        break
      case '90d':
        dataInicio.setDate(agora.getDate() - 90)
        break
      case '1y':
        dataInicio.setFullYear(agora.getFullYear() - 1)
        break
      default:
        dataInicio.setDate(agora.getDate() - 30)
    }

    // Filtros base
    const whereAgendamentos = {
      criadoEm: {
        gte: dataInicio,
        lte: agora
      }
    }

    const whereEstabelecimentos = {}
    const whereClientes = {}

    // Aplicar filtros específicos
    if (estabelecimento) {
      whereAgendamentos.estabelecimentoId = estabelecimento
      whereEstabelecimentos.id = estabelecimento
    }

    if (plano) {
      whereEstabelecimentos.planoId = plano
    }

    // Buscar dados básicos
    const [
      totalClientes,
      totalEstabelecimentos,
      totalAgendamentos,
      agendamentosPorStatus,
      receitaTotal
    ] = await Promise.all([
      prisma.cliente.count({ where: whereClientes }),
      prisma.estabelecimento.count({ where: whereEstabelecimentos }),
      prisma.agendamento.count({ where: whereAgendamentos }),
      prisma.agendamento.groupBy({
        by: ['status'],
        where: whereAgendamentos,
        _count: true
      }),
      prisma.agendamento.aggregate({
        where: {
          ...whereAgendamentos,
          status: 'CONCLUIDO'
        },
        _sum: {
          // Assumindo que temos um campo preco no agendamento ou precisamos calcular via serviço
        }
      })
    ])

    // Calcular receita real dos agendamentos concluídos
    const agendamentosConcluidos = await prisma.agendamento.findMany({
      where: {
        ...whereAgendamentos,
        status: 'CONCLUIDO'
      },
      include: {
        servico: {
          select: { preco: true }
        }
      }
    })

    const receitaCalculada = agendamentosConcluidos.reduce((sum, ag) => sum + (ag.servico?.preco || 0), 0)

    // Dados de crescimento (comparar com período anterior)
    const dataInicioAnterior = new Date(dataInicio)
    dataInicioAnterior.setTime(dataInicioAnterior.getTime() - (agora.getTime() - dataInicio.getTime()))

    const [
      clientesAnterior,
      estabelecimentosAnterior,
      agendamentosAnterior
    ] = await Promise.all([
      prisma.cliente.count({
        where: {
          ...whereClientes,
          criadoEm: {
            gte: dataInicioAnterior,
            lt: dataInicio
          }
        }
      }),
      prisma.estabelecimento.count({
        where: {
          ...whereEstabelecimentos,
          criadoEm: {
            gte: dataInicioAnterior,
            lt: dataInicio
          }
        }
      }),
      prisma.agendamento.count({
        where: {
          ...whereAgendamentos,
          criadoEm: {
            gte: dataInicioAnterior,
            lt: dataInicio
          }
        }
      })
    ])

    // Calcular percentuais de crescimento
    const crescimentoUsuarios = clientesAnterior > 0 
      ? ((totalClientes - clientesAnterior) / clientesAnterior * 100).toFixed(1)
      : 0

    const crescimentoEstabelecimentos = estabelecimentosAnterior > 0
      ? ((totalEstabelecimentos - estabelecimentosAnterior) / estabelecimentosAnterior * 100).toFixed(1)
      : 0

    const crescimentoAgendamentos = agendamentosAnterior > 0
      ? ((totalAgendamentos - agendamentosAnterior) / agendamentosAnterior * 100).toFixed(1)
      : 0

    // Top estabelecimentos por agendamentos
    const topEstabelecimentos = await prisma.agendamento.groupBy({
      by: ['estabelecimentoId'],
      where: whereAgendamentos,
      _count: true,
      orderBy: {
        _count: {
          estabelecimentoId: 'desc'
        }
      },
      take: 5
    })

    // Buscar dados dos estabelecimentos
    const estabelecimentosComDados = await Promise.all(
      topEstabelecimentos.map(async (est) => {
        const estabelecimento = await prisma.estabelecimento.findUnique({
          where: { id: est.estabelecimentoId },
          select: { nome: true }
        })

        // Calcular receita do estabelecimento
        const receitaEstabelecimento = await prisma.agendamento.findMany({
          where: {
            estabelecimentoId: est.estabelecimentoId,
            status: 'CONCLUIDO',
            criadoEm: {
              gte: dataInicio,
              lte: agora
            }
          },
          include: {
            servico: { select: { preco: true } }
          }
        })

        const receita = receitaEstabelecimento.reduce((sum, ag) => sum + (ag.servico?.preco || 0), 0)

        return {
          nome: estabelecimento?.nome || 'Estabelecimento não encontrado',
          agendamentos: est._count.estabelecimentoId,
          receita: Math.round(receita * 100) / 100
        }
      })
    )

    // Dados por mês (últimos 6 meses)
    const dadosPorMes = []
    for (let i = 5; i >= 0; i--) {
      const dataMes = new Date()
      dataMes.setMonth(dataMes.getMonth() - i)
      dataMes.setDate(1)
      dataMes.setHours(0, 0, 0, 0)

      const proximoMes = new Date(dataMes)
      proximoMes.setMonth(proximoMes.getMonth() + 1)

      const [usuariosMes, estabelecimentosMes] = await Promise.all([
        prisma.cliente.count({
          where: {
            criadoEm: {
              gte: dataMes,
              lt: proximoMes
            }
          }
        }),
        prisma.estabelecimento.count({
          where: {
            criadoEm: {
              gte: dataMes,
              lt: proximoMes
            }
          }
        })
      ])

      dadosPorMes.push({
        mes: dataMes.toLocaleDateString('pt-BR', { month: 'short' }),
        usuarios: usuariosMes,
        estabelecimentos: estabelecimentosMes
      })
    }

    // Dados de receita por plano
    const receitaPorPlano = await prisma.assinatura.groupBy({
      by: ['planoId'],
      where: { ativo: true },
      _count: true
    })

    const planosComReceita = await Promise.all(
      receitaPorPlano.map(async (plano) => {
        const planoData = await prisma.plano.findUnique({
          where: { id: plano.planoId },
          select: { nome: true, preco: true }
        })

        return {
          plano: planoData?.nome || 'Plano não encontrado',
          quantidade: plano._count.planoId,
          receita: (planoData?.preco || 0) * plano._count.planoId
        }
      })
    )

    // Formatar agendamentos por status
    const agendamentosPorStatusFormatado = agendamentosPorStatus.map(item => {
      const total = agendamentosPorStatus.reduce((sum, i) => sum + i._count.status, 0)
      return {
        status: item.status,
        quantidade: item._count.status,
        porcentagem: total > 0 ? ((item._count.status / total) * 100).toFixed(1) : 0
      }
    })

    const resultado = {
      resumo: {
        totalUsuarios: totalClientes,
        totalEstabelecimentos,
        totalAgendamentos,
        receitaTotal: Math.round(receitaCalculada * 100) / 100,
        crescimentoUsuarios: parseFloat(crescimentoUsuarios),
        crescimentoEstabelecimentos: parseFloat(crescimentoEstabelecimentos),
        crescimentoAgendamentos: parseFloat(crescimentoAgendamentos)
      },
      usuariosPorMes: dadosPorMes,
      agendamentosPorStatus: agendamentosPorStatusFormatado,
      receitaPorPlano: planosComReceita,
      topEstabelecimentos: estabelecimentosComDados
    }

    res.json(resultado)
  } catch (error) {
    console.error('Erro ao buscar relatórios avançados:', error)
    res.status(500).json({ error: 'Erro ao buscar relatórios avançados' })
  }
}

