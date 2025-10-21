import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../utils/password.js'

const prisma = new PrismaClient()

// =====================================================
// DASHBOARD & ESTATÍSTICAS
// =====================================================

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

