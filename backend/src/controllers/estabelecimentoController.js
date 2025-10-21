import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lista todos os estabelecimentos com filtros opcionais
 */
export const getEstabelecimentos = async (req, res) => {
  try {
    const { categoria, cidade, nome } = req.query;

    const where = {};

    if (categoria) {
      where.categoria = categoria;
    }

    if (cidade) {
      where.endereco = { contains: cidade, mode: 'insensitive' };
    }

    if (nome) {
      where.nome = { contains: nome, mode: 'insensitive' };
    }

    const estabelecimentos = await prisma.estabelecimento.findMany({
      where,
      select: {
        id: true,
        nome: true,
        categoria: true,
        descricao: true,
        endereco: true,
        telefone: true,
        fotoPerfilUrl: true,
        imagemCapa: true,
        criadoEm: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(estabelecimentos);
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos:', error);
    res.status(500).json({ error: 'Erro ao buscar estabelecimentos' });
  }
};

/**
 * Obtém detalhes de um estabelecimento específico
 */
export const getEstabelecimentoById = async (req, res) => {
  try {
    const { id } = req.params;

    const estabelecimento = await prisma.estabelecimento.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        categoria: true,
        descricao: true,
        endereco: true,
        telefone: true,
        email: true,
        imagemCapa: true,
        criadoEm: true,
        servicos: {
          where: { ativo: true },
          select: {
            id: true,
            nome: true,
            duracaoMin: true,
            preco: true,
            descricao: true
          }
        },
        horarios: {
          where: { ativo: true },
          orderBy: { diaSemana: 'asc' }
        }
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    res.json(estabelecimento);
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error);
    res.status(500).json({ error: 'Erro ao buscar estabelecimento' });
  }
};

/**
 * Atualiza dados do estabelecimento
 */
export const updateEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, endereco, telefone, categoria, imagemCapa } = req.body;

    // Verifica se o estabelecimento está atualizando seus próprios dados
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const estabelecimento = await prisma.estabelecimento.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(endereco && { endereco }),
        ...(telefone && { telefone }),
        ...(categoria && { categoria }),
        ...(imagemCapa !== undefined && { imagemCapa })
      },
      select: {
        id: true,
        nome: true,
        categoria: true,
        descricao: true,
        endereco: true,
        telefone: true,
        email: true,
        imagemCapa: true,
        atualizadoEm: true
      }
    });

    res.json({
      message: 'Estabelecimento atualizado com sucesso',
      estabelecimento
    });
  } catch (error) {
    console.error('Erro ao atualizar estabelecimento:', error);
    res.status(500).json({ error: 'Erro ao atualizar estabelecimento' });
  }
};

/**
 * Cria um novo serviço
 */
export const createServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, duracaoMin, preco, descricao } = req.body;

    // Verifica se o estabelecimento está criando seu próprio serviço
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (!nome || !duracaoMin || !preco) {
      return res.status(400).json({ error: 'Nome, duração e preço são obrigatórios' });
    }

    const servico = await prisma.servico.create({
      data: {
        estabelecimentoId: id,
        nome,
        duracaoMin: parseInt(duracaoMin),
        preco: parseFloat(preco),
        descricao
      }
    });

    res.status(201).json({
      message: 'Serviço criado com sucesso',
      servico
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
};

/**
 * Lista todos os serviços de um estabelecimento
 */
export const getServicos = async (req, res) => {
  try {
    const { id } = req.params;

    const servicos = await prisma.servico.findMany({
      where: { estabelecimentoId: id },
      orderBy: { nome: 'asc' }
    });

    res.json(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
};

/**
 * Atualiza um serviço
 */
export const updateServico = async (req, res) => {
  try {
    const { id, servicoId } = req.params;
    const { nome, duracaoMin, preco, descricao, ativo } = req.body;

    // Verifica se o estabelecimento está atualizando seu próprio serviço
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const servico = await prisma.servico.update({
      where: { id: servicoId },
      data: {
        ...(nome && { nome }),
        ...(duracaoMin && { duracaoMin: parseInt(duracaoMin) }),
        ...(preco && { preco: parseFloat(preco) }),
        ...(descricao !== undefined && { descricao }),
        ...(ativo !== undefined && { ativo })
      }
    });

    res.json({
      message: 'Serviço atualizado com sucesso',
      servico
    });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

/**
 * Deleta (desativa) um serviço
 */
export const deleteServico = async (req, res) => {
  try {
    const { id, servicoId } = req.params;

    // Verifica se o estabelecimento está deletando seu próprio serviço
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.servico.update({
      where: { id: servicoId },
      data: { ativo: false }
    });

    res.json({ message: 'Serviço desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
};

/**
 * Define horários de funcionamento
 */
export const createHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { diaSemana, horaInicio, horaFim } = req.body;

    // Verifica se o estabelecimento está criando seus próprios horários
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (diaSemana === undefined || !horaInicio || !horaFim) {
      return res.status(400).json({ error: 'Dia da semana, hora início e hora fim são obrigatórios' });
    }

    const horario = await prisma.horario.create({
      data: {
        estabelecimentoId: id,
        diaSemana: parseInt(diaSemana),
        horaInicio,
        horaFim
      }
    });

    res.status(201).json({
      message: 'Horário criado com sucesso',
      horario
    });
  } catch (error) {
    console.error('Erro ao criar horário:', error);
    res.status(500).json({ error: 'Erro ao criar horário' });
  }
};

/**
 * Upload de logo/foto de perfil do estabelecimento
 */
export const uploadLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;

    // Verificar se o estabelecimento existe e pertence ao usuário
    const estabelecimento = await prisma.estabelecimento.findFirst({
      where: {
        id: estabelecimentoId,
        id: id // Verificar se o ID da URL corresponde ao ID do usuário
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Verificar se há arquivo enviado
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    // URL da imagem (em produção, seria salva no cloud storage)
    const logoUrl = `/uploads/estabelecimentos/${req.file.filename}`;

    // Atualizar o estabelecimento com a URL da logo
    const estabelecimentoAtualizado = await prisma.estabelecimento.update({
      where: { id: estabelecimentoId },
      data: { fotoPerfilUrl: logoUrl },
      select: {
        id: true,
        nome: true,
        fotoPerfilUrl: true
      }
    });

    res.json({
      message: 'Logo atualizada com sucesso',
      estabelecimento: estabelecimentoAtualizado
    });
  } catch (error) {
    console.error('Erro ao fazer upload da logo:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da logo' });
  }
};

/**
 * Remover logo do estabelecimento
 */
export const removeLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;

    // Verificar se o estabelecimento existe e pertence ao usuário
    const estabelecimento = await prisma.estabelecimento.findFirst({
      where: {
        id: estabelecimentoId,
        id: id
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Remover a URL da logo
    const estabelecimentoAtualizado = await prisma.estabelecimento.update({
      where: { id: estabelecimentoId },
      data: { fotoPerfilUrl: null },
      select: {
        id: true,
        nome: true,
        fotoPerfilUrl: true
      }
    });

    res.json({
      message: 'Logo removida com sucesso',
      estabelecimento: estabelecimentoAtualizado
    });
  } catch (error) {
    console.error('Erro ao remover logo:', error);
    res.status(500).json({ error: 'Erro ao remover logo' });
  }
};

