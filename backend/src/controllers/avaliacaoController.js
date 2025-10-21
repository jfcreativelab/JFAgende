import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Criar avaliação para um agendamento
 */
export const createAvaliacao = async (req, res) => {
  try {
    const { agendamentoId, nota, comentario } = req.body;
    const clienteId = req.user.id;

    if (!agendamentoId || !nota) {
      return res.status(400).json({ error: 'Agendamento e nota são obrigatórios' });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ error: 'A nota deve ser entre 1 e 5' });
    }

    // Verifica se o agendamento existe e pertence ao cliente
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: { avaliacao: true }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (agendamento.clienteId !== clienteId) {
      return res.status(403).json({ error: 'Você não pode avaliar este agendamento' });
    }

    if (agendamento.status !== 'CONCLUIDO') {
      return res.status(400).json({ error: 'Apenas agendamentos concluídos podem ser avaliados' });
    }

    if (agendamento.avaliacao) {
      return res.status(400).json({ error: 'Este agendamento já foi avaliado' });
    }

    // Cria a avaliação
    const avaliacao = await prisma.avaliacao.create({
      data: {
        agendamentoId,
        clienteId,
        estabelecimentoId: agendamento.estabelecimentoId,
        nota: parseInt(nota),
        comentario
      },
      include: {
        cliente: {
          select: {
            nome: true,
            fotoPerfil: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Avaliação criada com sucesso',
      avaliacao
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
};

/**
 * Listar avaliações de um estabelecimento
 */
export const getAvaliacoesByEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params;

    const avaliacoes = await prisma.avaliacao.findMany({
      where: { estabelecimentoId: id },
      include: {
        cliente: {
          select: {
            nome: true,
            fotoPerfil: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    // Calcula média
    const media = avaliacoes.length > 0
      ? avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length
      : 0;

    res.json({
      avaliacoes,
      total: avaliacoes.length,
      media: parseFloat(media.toFixed(1))
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
};

/**
 * Atualizar avaliação
 */
export const updateAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, comentario } = req.body;
    const clienteId = req.user.id;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (avaliacao.clienteId !== clienteId) {
      return res.status(403).json({ error: 'Você não pode editar esta avaliação' });
    }

    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: { id },
      data: {
        ...(nota && { nota: parseInt(nota) }),
        ...(comentario !== undefined && { comentario })
      }
    });

    res.json({
      message: 'Avaliação atualizada com sucesso',
      avaliacao: avaliacaoAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ error: 'Erro ao atualizar avaliação' });
  }
};

/**
 * Deletar avaliação
 */
export const deleteAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteId = req.user.id;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (avaliacao.clienteId !== clienteId) {
      return res.status(403).json({ error: 'Você não pode deletar esta avaliação' });
    }

    await prisma.avaliacao.delete({
      where: { id }
    });

    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ error: 'Erro ao deletar avaliação' });
  }
};


