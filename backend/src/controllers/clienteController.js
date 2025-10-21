import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Obtém dados do cliente logado
 */
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o cliente está acessando seus próprios dados
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        fotoPerfil: true,
        criadoEm: true
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

/**
 * Atualiza dados do cliente
 */
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, fotoPerfil } = req.body;

    // Verifica se o cliente está atualizando seus próprios dados
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(telefone && { telefone }),
        ...(fotoPerfil !== undefined && { fotoPerfil })
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        fotoPerfil: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      cliente
    });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

/**
 * Lista todos os agendamentos do cliente
 */
export const getClienteAgendamentos = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o cliente está acessando seus próprios agendamentos
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: { clienteId: id },
      include: {
        estabelecimento: {
          select: {
            nome: true,
            endereco: true,
            telefone: true,
            imagemCapa: true
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
      orderBy: { dataHora: 'desc' }
    });

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

