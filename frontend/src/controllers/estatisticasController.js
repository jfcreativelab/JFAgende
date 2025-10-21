import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Obtém estatísticas do estabelecimento
 */
export const getEstatisticas = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;

    // Total de agendamentos
    const totalAgendamentos = await prisma.agendamento.count({
      where: { estabelecimentoId }
    });

    // Agendamentos por status
    const agendamentosPorStatus = await prisma.agendamento.groupBy({
      by: ['status'],
      where: { estabelecimentoId },
      _count: true
    });

    // Agendamentos do mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const agendamentosMesAtual = await prisma.agendamento.count({
      where: {
        estabelecimentoId,
        criadoEm: { gte: inicioMes }
      }
    });

    // Agendamentos do mês anterior
    const inicioMesAnterior = new Date(inicioMes);
    inicioMesAnterior.setMonth(inicioMesAnterior.getMonth() - 1);
    const fimMesAnterior = new Date(inicioMes);
    fimMesAnterior.setMilliseconds(-1);

    const agendamentosMesAnterior = await prisma.agendamento.count({
      where: {
        estabelecimentoId,
        criadoEm: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior
        }
      }
    });

    // Receita total (agendamentos concluídos)
    const agendamentosConcluidos = await prisma.agendamento.findMany({
      where: {
        estabelecimentoId,
        status: 'CONCLUIDO'
      },
      include: {
        servico: {
          select: { preco: true }
        }
      }
    });

    const receitaTotal = agendamentosConcluidos.reduce((sum, a) => sum + a.servico.preco, 0);

    // Média de avaliações
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { estabelecimentoId },
      select: { nota: true }
    });

    const mediaAvaliacoes = avaliacoes.length > 0
      ? avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length
      : 0;

    // Serviço mais popular
    const servicosMaisAgendados = await prisma.agendamento.groupBy({
      by: ['servicoId'],
      where: { estabelecimentoId },
      _count: true,
      orderBy: { _count: { servicoId: 'desc' } },
      take: 1
    });

    let servicoMaisPopular = null;
    if (servicosMaisAgendados.length > 0) {
      servicoMaisPopular = await prisma.servico.findUnique({
        where: { id: servicosMaisAgendados[0].servicoId },
        select: { nome: true }
      });
    }

    res.json({
      totalAgendamentos,
      agendamentosMesAtual,
      agendamentosMesAnterior,
      crescimentoMensal: agendamentosMesAnterior > 0
        ? ((agendamentosMesAtual - agendamentosMesAnterior) / agendamentosMesAnterior * 100).toFixed(1)
        : 100,
      agendamentosPorStatus: agendamentosPorStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      receitaTotal,
      mediaAvaliacoes: parseFloat(mediaAvaliacoes.toFixed(1)),
      totalAvaliacoes: avaliacoes.length,
      servicoMaisPopular: servicoMaisPopular?.nome || 'N/A'
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};


