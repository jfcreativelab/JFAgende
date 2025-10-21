import { PrismaClient } from '@prisma/client';
import { addDays, addMonths, isAfter } from 'date-fns';
import { obterEstatisticasUso } from '../middleware/planoMiddleware.js';

const prisma = new PrismaClient();

/**
 * Listar todos os planos disponíveis
 */
export const listarPlanos = async (req, res) => {
  try {
    const planos = await prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { preco: 'asc' }
    });

    res.json(planos);
  } catch (error) {
    console.error('Erro ao listar planos:', error);
    res.status(500).json({ error: 'Erro ao listar planos' });
  }
};

/**
 * Obter assinatura atual do estabelecimento
 */
export const obterAssinaturaAtual = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;

    let assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId },
      include: { plano: true }
    });

    // Se não tem assinatura, criar FREE automaticamente
    if (!assinatura) {
      const planoFree = await prisma.plano.findFirst({
        where: { nome: 'FREE' }
      });

      if (planoFree) {
        assinatura = await prisma.assinatura.create({
          data: {
            estabelecimentoId,
            planoId: planoFree.id,
            ativo: true
          },
          include: { plano: true }
        });
      }
    }

    // Obter estatísticas de uso
    const estatisticas = await obterEstatisticasUso(estabelecimentoId);

    res.json({
      assinatura,
      estatisticas
    });
  } catch (error) {
    console.error('Erro ao obter assinatura:', error);
    res.status(500).json({ error: 'Erro ao obter assinatura' });
  }
};

/**
 * Fazer upgrade de plano
 */
export const fazerUpgrade = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;
    const { planoId, metodoPagamento } = req.body;

    if (!planoId) {
      return res.status(400).json({ error: 'ID do plano é obrigatório' });
    }

    // Buscar plano desejado
    const novoPlano = await prisma.plano.findUnique({
      where: { id: planoId }
    });

    if (!novoPlano || !novoPlano.ativo) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // Buscar assinatura atual
    const assinaturaAtual = await prisma.assinatura.findUnique({
      where: { estabelecimentoId },
      include: { plano: true }
    });

    // Verificar se é realmente um upgrade
    if (assinaturaAtual && assinaturaAtual.plano.preco >= novoPlano.preco) {
      return res.status(400).json({ 
        error: 'Não é possível fazer upgrade para um plano de valor igual ou inferior',
        sugestao: 'Use a função de mudar plano'
      });
    }

    // AQUI SERIA A INTEGRAÇÃO COM GATEWAY DE PAGAMENTO
    // Por enquanto, vamos simular o pagamento como aprovado

    const agora = new Date();
    const dataFim = addMonths(agora, 1); // Assinatura de 1 mês

    // Calcular data de destaque se for PREMIUM
    let destaqueAte = null;
    if (novoPlano.permiteDestaque && novoPlano.diasDestaque > 0) {
      destaqueAte = addDays(agora, novoPlano.diasDestaque);
    }

    // Atualizar ou criar assinatura
    const assinatura = await prisma.assinatura.upsert({
      where: { estabelecimentoId },
      update: {
        planoId: novoPlano.id,
        dataFim,
        ativo: true,
        autoRenovar: true,
        destaqueAte
      },
      create: {
        estabelecimentoId,
        planoId: novoPlano.id,
        dataFim,
        ativo: true,
        autoRenovar: true,
        destaqueAte
      },
      include: { plano: true }
    });

    res.json({
      message: 'Upgrade realizado com sucesso!',
      assinatura,
      destaque: destaqueAte ? {
        ativo: true,
        ate: destaqueAte,
        diasRestantes: novoPlano.diasDestaque
      } : null
    });
  } catch (error) {
    console.error('Erro ao fazer upgrade:', error);
    res.status(500).json({ error: 'Erro ao processar upgrade' });
  }
};

/**
 * Cancelar assinatura (downgrade para FREE)
 */
export const cancelarAssinatura = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;

    // Buscar plano FREE
    const planoFree = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    });

    if (!planoFree) {
      return res.status(500).json({ error: 'Plano FREE não encontrado' });
    }

    // Atualizar assinatura para FREE
    const assinatura = await prisma.assinatura.update({
      where: { estabelecimentoId },
      data: {
        planoId: planoFree.id,
        dataFim: null, // FREE não expira
        autoRenovar: false,
        destaqueAte: null // Remove destaque
      },
      include: { plano: true }
    });

    res.json({
      message: 'Assinatura cancelada. Você foi migrado para o plano FREE.',
      assinatura
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  }
};

/**
 * Verificar se estabelecimento está em destaque
 */
export const verificarDestaque = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;

    const assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId },
      include: { plano: true }
    });

    if (!assinatura || !assinatura.destaqueAte) {
      return res.json({
        emDestaque: false
      });
    }

    const agora = new Date();
    const emDestaque = isAfter(assinatura.destaqueAte, agora);

    res.json({
      emDestaque,
      destaqueAte: assinatura.destaqueAte,
      plano: assinatura.plano.nome
    });
  } catch (error) {
    console.error('Erro ao verificar destaque:', error);
    res.status(500).json({ error: 'Erro ao verificar destaque' });
  }
};

/**
 * Listar estabelecimentos em destaque
 */
export const listarDestaques = async (req, res) => {
  try {
    const agora = new Date();

    const assinaturas = await prisma.assinatura.findMany({
      where: {
        ativo: true,
        destaqueAte: {
          gte: agora // Destaque ainda válido
        }
      },
      include: {
        estabelecimento: {
          include: {
            avaliacoes: true
          }
        },
        plano: true
      },
      orderBy: {
        destaqueAte: 'desc' // Mais recentes primeiro
      }
    });

    // Calcular média de avaliações
    const destaques = assinaturas.map(assinatura => {
      const avaliacoes = assinatura.estabelecimento.avaliacoes;
      const mediaAvaliacoes = avaliacoes.length > 0
        ? avaliacoes.reduce((sum, av) => sum + av.nota, 0) / avaliacoes.length
        : 0;

      return {
        ...assinatura.estabelecimento,
        plano: assinatura.plano.nome,
        destaqueAte: assinatura.destaqueAte,
        mediaAvaliacoes,
        totalAvaliacoes: avaliacoes.length
      };
    });

    res.json(destaques);
  } catch (error) {
    console.error('Erro ao listar destaques:', error);
    res.status(500).json({ error: 'Erro ao listar destaques' });
  }
};

/**
 * Obter comparação de planos (para página de pricing)
 */
export const compararPlanos = async (req, res) => {
  try {
    const planos = await prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { preco: 'asc' }
    });

    const comparacao = planos.map(plano => ({
      id: plano.id,
      nome: plano.nome,
      descricao: plano.descricao,
      preco: plano.preco,
      recursos: {
        agendamentosDia: plano.limiteAgendamentosDia || 'Ilimitado',
        agendamentosMes: plano.limiteAgendamentos === -1 ? 'Ilimitado' : plano.limiteAgendamentos,
        portfolio: plano.permitePortfolio,
        relatorios: plano.permiteRelatorios,
        destaque: plano.permiteDestaque,
        diasDestaque: plano.diasDestaque
      },
      recomendado: plano.nome === 'PREMIUM'
    }));

    res.json(comparacao);
  } catch (error) {
    console.error('Erro ao comparar planos:', error);
    res.status(500).json({ error: 'Erro ao comparar planos' });
  }
};

/**
 * Ativar destaque manual (admin)
 */
export const ativarDestaque = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const { dias = 7 } = req.body;

    const assinatura = await prisma.assinatura.findUnique({
      where: { estabelecimentoId },
      include: { plano: true }
    });

    if (!assinatura) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    if (!assinatura.plano.permiteDestaque) {
      return res.status(403).json({ 
        error: 'Plano atual não permite destaque',
        planoNecessario: 'PREMIUM'
      });
    }

    const agora = new Date();
    const destaqueAte = addDays(agora, dias);

    const assinaturaAtualizada = await prisma.assinatura.update({
      where: { estabelecimentoId },
      data: { destaqueAte },
      include: { plano: true }
    });

    res.json({
      message: `Destaque ativado por ${dias} dias`,
      assinatura: assinaturaAtualizada,
      destaqueAte
    });
  } catch (error) {
    console.error('Erro ao ativar destaque:', error);
    res.status(500).json({ error: 'Erro ao ativar destaque' });
  }
};

/**
 * Criar novo plano (apenas para setup)
 */
export const criarPlano = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      preco,
      limiteAgendamentos,
      limiteAgendamentosDia,
      permitePortfolio,
      permiteRelatorios,
      permiteDestaque,
      diasDestaque,
      ativo = true
    } = req.body;

    // Validações básicas
    if (!nome || !descricao || preco === undefined) {
      return res.status(400).json({ error: 'Nome, descrição e preço são obrigatórios' });
    }

    const plano = await prisma.plano.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        limiteAgendamentos: parseInt(limiteAgendamentos) || 0,
        limiteAgendamentosDia: parseInt(limiteAgendamentosDia) || 0,
        permitePortfolio: Boolean(permitePortfolio),
        permiteRelatorios: Boolean(permiteRelatorios),
        permiteDestaque: Boolean(permiteDestaque),
        diasDestaque: parseInt(diasDestaque) || 0,
        ativo: Boolean(ativo)
      }
    });

    res.status(201).json(plano);
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    res.status(500).json({ error: 'Erro ao criar plano' });
  }
};

