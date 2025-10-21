import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Adicionar estabelecimento aos favoritos
 */
export const addFavorito = async (req, res) => {
  try {
    const { estabelecimentoId } = req.body;
    const clienteId = req.user.id;

    if (!estabelecimentoId) {
      return res.status(400).json({ error: 'ID do estabelecimento é obrigatório' });
    }

    // Verifica se o estabelecimento existe
    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { id: estabelecimentoId }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Verifica se já está nos favoritos
    const favoritoExistente = await prisma.favorito.findFirst({
      where: {
        clienteId,
        estabelecimentoId
      }
    });

    if (favoritoExistente) {
      return res.status(400).json({ error: 'Estabelecimento já está nos favoritos' });
    }

    // Adiciona aos favoritos
    const favorito = await prisma.favorito.create({
      data: {
        clienteId,
        estabelecimentoId
      }
    });

    res.status(201).json({
      message: 'Estabelecimento adicionado aos favoritos',
      favorito
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
};

/**
 * Remover estabelecimento dos favoritos
 */
export const removeFavorito = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const clienteId = req.user.id;

    const favorito = await prisma.favorito.findFirst({
      where: {
        clienteId,
        estabelecimentoId
      }
    });

    if (!favorito) {
      return res.status(404).json({ error: 'Favorito não encontrado' });
    }

    await prisma.favorito.delete({
      where: { id: favorito.id }
    });

    res.json({ message: 'Estabelecimento removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro ao remover favorito' });
  }
};

/**
 * Listar favoritos do cliente
 */
export const getFavoritos = async (req, res) => {
  try {
    const clienteId = req.user.id;

    const favoritos = await prisma.favorito.findMany({
      where: { clienteId },
      include: {
        estabelecimento: {
          select: {
            id: true,
            nome: true,
            categoria: true,
            descricao: true,
            endereco: true,
            telefone: true,
            imagemCapa: true,
            criadoEm: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    res.json(favoritos.map(f => f.estabelecimento));
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
};

/**
 * Verificar se estabelecimento está nos favoritos
 */
export const isFavorito = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const clienteId = req.user.id;

    const favorito = await prisma.favorito.findFirst({
      where: {
        clienteId,
        estabelecimentoId
      }
    });

    res.json({ isFavorito: !!favorito });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({ error: 'Erro ao verificar favorito' });
  }
};


