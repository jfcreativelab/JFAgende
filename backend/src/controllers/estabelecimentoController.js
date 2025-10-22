import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        fotoPerfilUrl: true,
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
 * Remove um serviço permanentemente
 */
export const deleteServico = async (req, res) => {
  try {
    const { id, servicoId } = req.params;

    // Verifica se o estabelecimento está deletando seu próprio serviço
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Verifica se o serviço existe e pertence ao estabelecimento
    const servico = await prisma.servico.findFirst({
      where: { 
        id: servicoId,
        estabelecimentoId: id
      }
    });

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Remove o serviço permanentemente
    await prisma.servico.delete({
      where: { id: servicoId }
    });

    res.json({ message: 'Serviço removido permanentemente' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro ao remover serviço' });
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

    // Processar imagem e mover de temp para uploads/estabelecimentos
    const tempPath = req.file.path; // caminho salvo pelo multer
    const destDir = path.join(__dirname, '../../uploads/estabelecimentos');
    await fs.mkdir(destDir, { recursive: true });

    const baseName = `logo-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalPath = path.join(destDir, `${baseName}.webp`);

    await sharp(tempPath)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(finalPath);

    // apagar arquivo temp
    try { await fs.unlink(tempPath); } catch {}

    // URL pública
    // URL da logo (URL completa para garantir persistência)
    const baseUrl = process.env.BASE_URL || 'https://jfagende-production.up.railway.app';
    const logoUrl = `${baseUrl}/uploads/estabelecimentos/${baseName}.webp`;

    // Remover logo antiga se existir
    const atual = await prisma.estabelecimento.findUnique({
      where: { id: estabelecimentoId },
      select: { fotoPerfilUrl: true }
    });
    if (atual?.fotoPerfilUrl) {
      const oldPath = path.join(__dirname, '../../', atual.fotoPerfilUrl.replace(/^\/+/, ''));
      try { await fs.unlink(oldPath); } catch {}
    }

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

    // Remover arquivo físico se existir
    if (estabelecimento.fotoPerfilUrl) {
      const filePath = path.join(__dirname, '../../', estabelecimento.fotoPerfilUrl.replace(/^\/+/, ''));
      try { await fs.unlink(filePath); } catch {}
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

/**
 * Obter horários de funcionamento do estabelecimento
 */
export const getHorarios = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;

    // Verificar se o estabelecimento existe e pertence ao usuário
    const estabelecimento = await prisma.estabelecimento.findFirst({
      where: {
        id: estabelecimentoId
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    const horarios = await prisma.horario.findMany({
      where: {
        estabelecimentoId: estabelecimentoId
      },
      orderBy: { diaSemana: 'asc' }
    });

    res.json(horarios);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: 'Erro ao buscar horários' });
  }
};

/**
 * Atualizar horários de funcionamento do estabelecimento
 */
export const updateHorarios = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;
    const { horarios } = req.body;

    // Verificar se o estabelecimento existe e pertence ao usuário
    const estabelecimento = await prisma.estabelecimento.findFirst({
      where: {
        id: estabelecimentoId
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Validar dados dos horários
    if (!Array.isArray(horarios)) {
      return res.status(400).json({ error: 'Horários devem ser um array' });
    }

    // Validar cada horário
    for (const horario of horarios) {
      if (typeof horario.diaSemana !== 'number' || horario.diaSemana < 0 || horario.diaSemana > 6) {
        return res.status(400).json({ error: 'Dia da semana deve ser um número de 0 a 6' });
      }
      if (!horario.horaInicio || !horario.horaFim) {
        return res.status(400).json({ error: 'Horário de início e fim são obrigatórios' });
      }
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.horaInicio) || 
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.horaFim)) {
        return res.status(400).json({ error: 'Formato de horário inválido. Use HH:mm' });
      }
    }

    // Remover horários existentes
    await prisma.horario.deleteMany({
      where: {
        estabelecimentoId: estabelecimentoId
      }
    });

    // Criar novos horários
    const horariosCriados = await prisma.horario.createMany({
      data: horarios.map(horario => ({
        estabelecimentoId: estabelecimentoId,
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFim: horario.horaFim,
        ativo: horario.ativo !== false // default true
      }))
    });

    res.json({
      message: 'Horários atualizados com sucesso',
      horarios: horariosCriados
    });
  } catch (error) {
    console.error('Erro ao atualizar horários:', error);
    res.status(500).json({ error: 'Erro ao atualizar horários' });
  }
};

/**
 * Atualizar chave PIX do estabelecimento
 */
export const updateChavePix = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;
    const { chavePix } = req.body;

    // Verificar se o estabelecimento existe e pertence ao usuário
    const estabelecimento = await prisma.estabelecimento.findFirst({
      where: {
        id: estabelecimentoId
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Validar chave PIX
    if (!chavePix || chavePix.trim().length === 0) {
      return res.status(400).json({ error: 'Chave PIX é obrigatória' });
    }

    const estabelecimentoAtualizado = await prisma.estabelecimento.update({
      where: {
        id: estabelecimentoId
      },
      data: {
        chavePix: chavePix.trim()
      },
      select: {
        id: true,
        nome: true,
        chavePix: true
      }
    });

    res.json({
      message: 'Chave PIX atualizada com sucesso',
      estabelecimento: estabelecimentoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar chave PIX:', error);
    res.status(500).json({ error: 'Erro ao atualizar chave PIX' });
  }
};

