import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Criar bloqueio de horário
 */
export const createBloqueio = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;
    const { dataInicio, dataFim, motivo } = req.body;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Data início e fim são obrigatórias' });
    }

    // Verifica se já existe agendamento nesse período
    const agendamentosConflitantes = await prisma.agendamento.findMany({
      where: {
        estabelecimentoId,
        dataHora: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        },
        status: {
          in: ['PENDENTE', 'CONFIRMADO']
        }
      }
    });

    if (agendamentosConflitantes.length > 0) {
      return res.status(400).json({ 
        error: 'Existem agendamentos nesse período. Cancele-os primeiro.',
        agendamentos: agendamentosConflitantes
      });
    }

    const bloqueio = await prisma.bloqueioHorario.create({
      data: {
        estabelecimentoId,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        motivo
      }
    });

    res.status(201).json({
      message: 'Horário bloqueado com sucesso',
      bloqueio
    });
  } catch (error) {
    console.error('Erro ao criar bloqueio:', error);
    res.status(500).json({ error: 'Erro ao criar bloqueio' });
  }
};

/**
 * Listar bloqueios do estabelecimento
 */
export const getBloqueios = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;
    const { dataInicio, dataFim } = req.query;

    const where = { estabelecimentoId };

    if (dataInicio && dataFim) {
      where.OR = [
        {
          dataInicio: {
            gte: new Date(dataInicio),
            lte: new Date(dataFim)
          }
        },
        {
          dataFim: {
            gte: new Date(dataInicio),
            lte: new Date(dataFim)
          }
        }
      ];
    }

    const bloqueios = await prisma.bloqueioHorario.findMany({
      where,
      orderBy: { dataInicio: 'asc' }
    });

    res.json(bloqueios);
  } catch (error) {
    console.error('Erro ao buscar bloqueios:', error);
    res.status(500).json({ error: 'Erro ao buscar bloqueios' });
  }
};

/**
 * Deletar bloqueio
 */
export const deleteBloqueio = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;

    const bloqueio = await prisma.bloqueioHorario.findUnique({
      where: { id }
    });

    if (!bloqueio) {
      return res.status(404).json({ error: 'Bloqueio não encontrado' });
    }

    if (bloqueio.estabelecimentoId !== estabelecimentoId) {
      return res.status(403).json({ error: 'Sem permissão para deletar este bloqueio' });
    }

    await prisma.bloqueioHorario.delete({
      where: { id }
    });

    res.json({ message: 'Bloqueio removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar bloqueio:', error);
    res.status(500).json({ error: 'Erro ao deletar bloqueio' });
  }
};

/**
 * Obter agenda completa do estabelecimento
 */
export const getAgendaCompleta = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;
    const { dataInicio, dataFim } = req.query;

    const inicioDate = new Date(dataInicio);
    const fimDate = new Date(dataFim);

    // Busca agendamentos
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        estabelecimentoId,
        dataHora: {
          gte: inicioDate,
          lte: fimDate
        }
      },
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true,
            email: true
          }
        },
        servico: {
          select: {
            nome: true,
            duracaoMin: true,
            preco: true
          }
        }
      },
      orderBy: { dataHora: 'asc' }
    });

    // Busca bloqueios
    const bloqueios = await prisma.bloqueioHorario.findMany({
      where: {
        estabelecimentoId,
        OR: [
          {
            dataInicio: {
              gte: inicioDate,
              lte: fimDate
            }
          },
          {
            dataFim: {
              gte: inicioDate,
              lte: fimDate
            }
          }
        ]
      }
    });

    res.json({
      agendamentos,
      bloqueios
    });
  } catch (error) {
    console.error('Erro ao buscar agenda:', error);
    res.status(500).json({ error: 'Erro ao buscar agenda' });
  }
};

/**
 * Gerar link do WhatsApp para confirmação
 */
export const gerarLinkWhatsApp = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: {
        cliente: true,
        estabelecimento: true,
        servico: true
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Formata a mensagem
    const dataFormatada = new Date(agendamento.dataHora).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mensagem = `Olá ${agendamento.cliente.nome}! 👋

✅ Seu agendamento foi confirmado!

📍 Local: ${agendamento.estabelecimento.nome}
💇 Serviço: ${agendamento.servico.nome}
📅 Data: ${dataFormatada}
💰 Valor: R$ ${agendamento.servico.preco.toFixed(2)}

Nos vemos lá! 😊`;

    // Remove o +55 se já tiver, e formata o número
    let telefone = agendamento.cliente.telefone.replace(/\D/g, '');
    if (!telefone.startsWith('55')) {
      telefone = '55' + telefone;
    }

    const linkWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    res.json({
      linkWhatsApp,
      telefone,
      mensagem
    });
  } catch (error) {
    console.error('Erro ao gerar link WhatsApp:', error);
    res.status(500).json({ error: 'Erro ao gerar link WhatsApp' });
  }
};


