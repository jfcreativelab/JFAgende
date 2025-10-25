import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar planos de um estabelecimento
export const getPlanosByEstabelecimento = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;

    const planos = await prisma.planoEstabelecimento.findMany({
      where: { 
        estabelecimentoId,
        ativo: true 
      },
      orderBy: { ordem: 'asc' }
    });

    res.json(planos);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Criar novo plano
export const createPlano = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const { nome, descricao, preco, cor, icone, servicos, popular, ordem } = req.body;

    // Validar dados obrigatórios
    if (!nome || !descricao || !preco || !servicos || !Array.isArray(servicos)) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: nome, descricao, preco, servicos' 
      });
    }

    // Verificar se já existe plano com mesmo nome
    const planoExistente = await prisma.planoEstabelecimento.findFirst({
      where: { 
        estabelecimentoId,
        nome: nome.trim()
      }
    });

    if (planoExistente) {
      return res.status(400).json({ 
        error: 'Já existe um plano com este nome' 
      });
    }

    const plano = await prisma.planoEstabelecimento.create({
      data: {
        estabelecimentoId,
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: parseFloat(preco),
        cor: cor || 'from-gray-500 to-gray-700',
        icone: icone || 'Star',
        servicos,
        popular: popular || false,
        ordem: ordem || 0
      }
    });

    res.status(201).json(plano);
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar plano
export const updatePlano = async (req, res) => {
  try {
    const { planoId } = req.params;
    const { nome, descricao, preco, cor, icone, servicos, popular, ordem, ativo } = req.body;

    // Verificar se o plano existe
    const planoExistente = await prisma.planoEstabelecimento.findUnique({
      where: { id: planoId }
    });

    if (!planoExistente) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // Verificar se nome já existe em outro plano
    if (nome && nome !== planoExistente.nome) {
      const planoComMesmoNome = await prisma.planoEstabelecimento.findFirst({
        where: { 
          estabelecimentoId: planoExistente.estabelecimentoId,
          nome: nome.trim(),
          id: { not: planoId }
        }
      });

      if (planoComMesmoNome) {
        return res.status(400).json({ 
          error: 'Já existe outro plano com este nome' 
        });
      }
    }

    const plano = await prisma.planoEstabelecimento.update({
      where: { id: planoId },
      data: {
        ...(nome && { nome: nome.trim() }),
        ...(descricao && { descricao: descricao.trim() }),
        ...(preco && { preco: parseFloat(preco) }),
        ...(cor && { cor }),
        ...(icone && { icone }),
        ...(servicos && { servicos }),
        ...(typeof popular === 'boolean' && { popular }),
        ...(typeof ordem === 'number' && { ordem }),
        ...(typeof ativo === 'boolean' && { ativo })
      }
    });

    res.json(plano);
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar plano
export const deletePlano = async (req, res) => {
  try {
    const { planoId } = req.params;

    // Verificar se o plano existe
    const plano = await prisma.planoEstabelecimento.findUnique({
      where: { id: planoId }
    });

    if (!plano) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // Verificar se há assinaturas ativas
    const assinaturasAtivas = await prisma.assinaturaPlano.count({
      where: { 
        planoEstabelecimentoId: planoId,
        ativo: true 
      }
    });

    if (assinaturasAtivas > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar plano com assinaturas ativas' 
      });
    }

    await prisma.planoEstabelecimento.delete({
      where: { id: planoId }
    });

    res.json({ message: 'Plano deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter plano específico
export const getPlanoById = async (req, res) => {
  try {
    const { planoId } = req.params;

    const plano = await prisma.planoEstabelecimento.findUnique({
      where: { id: planoId },
      include: {
        assinaturas: {
          where: { ativo: true },
          include: {
            cliente: {
              select: { id: true, nome: true, email: true }
            }
          }
        }
      }
    });

    if (!plano) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    res.json(plano);
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Reordenar planos
export const reordenarPlanos = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const { planos } = req.body; // Array com { id, ordem }

    if (!Array.isArray(planos)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    // Atualizar ordem de cada plano
    const promises = planos.map(({ id, ordem }) =>
      prisma.planoEstabelecimento.update({
        where: { id },
        data: { ordem }
      })
    );

    await Promise.all(promises);

    res.json({ message: 'Planos reordenados com sucesso' });
  } catch (error) {
    console.error('Erro ao reordenar planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Estatísticas dos planos
export const getEstatisticasPlanos = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;

    const [
      totalPlanos,
      planosAtivos,
      totalAssinaturas,
      receitaMensal,
      planoMaisPopular
    ] = await Promise.all([
      prisma.planoEstabelecimento.count({
        where: { estabelecimentoId }
      }),
      prisma.planoEstabelecimento.count({
        where: { estabelecimentoId, ativo: true }
      }),
      prisma.assinaturaPlano.count({
        where: { 
          planoEstabelecimento: { estabelecimentoId },
          ativo: true 
        }
      }),
      prisma.assinaturaPlano.aggregate({
        where: { 
          planoEstabelecimento: { estabelecimentoId },
          ativo: true 
        },
        _sum: { planoEstabelecimento: { preco: true } }
      }),
      prisma.planoEstabelecimento.findFirst({
        where: { 
          estabelecimentoId,
          ativo: true,
          popular: true 
        },
        select: { nome: true, preco: true }
      })
    ]);

    res.json({
      totalPlanos,
      planosAtivos,
      totalAssinaturas,
      receitaMensal: receitaMensal._sum.planoEstabelecimento || 0,
      planoMaisPopular
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
