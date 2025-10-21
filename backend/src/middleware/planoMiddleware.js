import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Middleware para verificar se o estabelecimento pode criar um novo agendamento
 * Verifica limites do plano (diário e mensal)
 */
export const verificarLimiteAgendamentos = async (req, res, next) => {
  try {
    const estabelecimentoId = req.body.estabelecimentoId || req.user.id;

    // Buscar assinatura do estabelecimento
    const assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId },
      include: { plano: true }
    });

    // Se não tem assinatura, criar uma FREE automaticamente
    if (!assinatura) {
      const planoFree = await prisma.plano.findFirst({
        where: { nome: 'FREE' }
      });

      if (planoFree) {
        await prisma.assinatura.create({
          data: {
            estabelecimentoId,
            planoId: planoFree.id,
            ativo: true
          }
        });

        // Buscar novamente
        const novaAssinatura = await prisma.assinatura.findUnique({
          where: { estabelecimentoId },
          include: { plano: true }
        });

        req.assinatura = novaAssinatura;
      }
    } else {
      req.assinatura = assinatura;
    }

    const plano = req.assinatura?.plano;

    if (!plano || !req.assinatura.ativo) {
      return res.status(403).json({ 
        error: 'Assinatura inativa ou não encontrada',
        requireUpgrade: true
      });
    }

    // Verificar limite por dia (apenas plano FREE)
    if (plano.limiteAgendamentosDia !== null) {
      const hoje = new Date();
      const inicioHoje = startOfDay(hoje);
      const fimHoje = endOfDay(hoje);

      const agendamentosHoje = await prisma.agendamento.count({
        where: {
          estabelecimentoId,
          dataHora: {
            gte: inicioHoje,
            lte: fimHoje
          },
          status: {
            in: ['PENDENTE', 'CONFIRMADO']
          }
        }
      });

      if (agendamentosHoje >= plano.limiteAgendamentosDia) {
        return res.status(403).json({
          error: `Limite diário de ${plano.limiteAgendamentosDia} agendamentos atingido`,
          limiteAtingido: true,
          planoAtual: plano.nome,
          sugestao: 'Faça upgrade para o plano BASIC ou PREMIUM para mais agendamentos',
          requireUpgrade: true
        });
      }
    }

    // Verificar limite mensal (plano BASIC)
    if (plano.limiteAgendamentos > 0) {
      const agora = new Date();
      const inicioMes = startOfMonth(agora);
      const fimMes = endOfMonth(agora);

      const agendamentosMes = await prisma.agendamento.count({
        where: {
          estabelecimentoId,
          dataHora: {
            gte: inicioMes,
            lte: fimMes
          },
          status: {
            in: ['PENDENTE', 'CONFIRMADO']
          }
        }
      });

      if (agendamentosMes >= plano.limiteAgendamentos) {
        return res.status(403).json({
          error: `Limite mensal de ${plano.limiteAgendamentos} agendamentos atingido`,
          limiteAtingido: true,
          planoAtual: plano.nome,
          sugestao: 'Faça upgrade para o plano PREMIUM para agendamentos ilimitados',
          requireUpgrade: true
        });
      }
    }

    // Adicionar informações do plano na requisição para uso posterior
    req.planoInfo = {
      nome: plano.nome,
      permitePortfolio: plano.permitePortfolio,
      permiteRelatorios: plano.permiteRelatorios,
      permiteDestaque: plano.permiteDestaque
    };

    next();
  } catch (error) {
    console.error('Erro ao verificar limites:', error);
    res.status(500).json({ error: 'Erro ao verificar limites do plano' });
  }
};

/**
 * Middleware para verificar se o estabelecimento tem permissão para acessar recurso
 */
export const verificarPermissaoRecurso = (recurso) => {
  return async (req, res, next) => {
    try {
      const estabelecimentoId = req.user.id;

      const assinatura = await prisma.assinatura.findUnique({
        where: { estabelecimentoId },
        include: { plano: true }
      });

      if (!assinatura || !assinatura.ativo) {
        return res.status(403).json({
          error: 'Assinatura inativa ou não encontrada',
          requireUpgrade: true
        });
      }

      const plano = assinatura.plano;

      // Verificar permissão específica
      let temPermissao = false;
      let mensagemErro = '';

      switch (recurso) {
        case 'portfolio':
          temPermissao = plano.permitePortfolio;
          mensagemErro = 'Portfólio disponível apenas para planos BASIC e PREMIUM';
          break;
        case 'relatorios':
          temPermissao = plano.permiteRelatorios;
          mensagemErro = 'Relatórios disponíveis apenas para planos BASIC e PREMIUM';
          break;
        case 'destaque':
          temPermissao = plano.permiteDestaque;
          mensagemErro = 'Destaque disponível apenas para plano PREMIUM';
          break;
        default:
          temPermissao = true;
      }

      if (!temPermissao) {
        return res.status(403).json({
          error: mensagemErro,
          planoAtual: plano.nome,
          recursoNecessario: recurso,
          requireUpgrade: true
        });
      }

      req.planoInfo = {
        nome: plano.nome,
        permitePortfolio: plano.permitePortfolio,
        permiteRelatorios: plano.permiteRelatorios,
        permiteDestaque: plano.permiteDestaque
      };

      next();
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
};

/**
 * Obter estatísticas de uso do plano
 */
export const obterEstatisticasUso = async (estabelecimentoId) => {
  try {
    const assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId },
      include: { plano: true }
    });

    if (!assinatura) {
      return null;
    }

    const plano = assinatura.plano;
    const agora = new Date();

    // Agendamentos hoje
    const inicioHoje = startOfDay(agora);
    const fimHoje = endOfDay(agora);
    const agendamentosHoje = await prisma.agendamento.count({
      where: {
        estabelecimentoId,
        dataHora: {
          gte: inicioHoje,
          lte: fimHoje
        },
        status: {
          in: ['PENDENTE', 'CONFIRMADO']
        }
      }
    });

    // Agendamentos este mês
    const inicioMes = startOfMonth(agora);
    const fimMes = endOfMonth(agora);
    const agendamentosMes = await prisma.agendamento.count({
      where: {
        estabelecimentoId,
        dataHora: {
          gte: inicioMes,
          lte: fimMes
        },
        status: {
          in: ['PENDENTE', 'CONFIRMADO']
        }
      }
    });

    return {
      planoNome: plano.nome,
      agendamentosHoje,
      limiteHoje: plano.limiteAgendamentosDia || 'Ilimitado',
      agendamentosMes,
      limiteMes: plano.limiteAgendamentos === -1 ? 'Ilimitado' : plano.limiteAgendamentos,
      percentualUsoDia: plano.limiteAgendamentosDia 
        ? (agendamentosHoje / plano.limiteAgendamentosDia * 100).toFixed(0)
        : 0,
      percentualUsoMes: plano.limiteAgendamentos > 0
        ? (agendamentosMes / plano.limiteAgendamentos * 100).toFixed(0)
        : 0
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
};

