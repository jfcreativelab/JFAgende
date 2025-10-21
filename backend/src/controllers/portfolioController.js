import { PrismaClient } from '@prisma/client';
import { processImage, deleteImage } from '../utils/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

/**
 * Upload de foto para portfólio
 */
export const uploadFoto = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;
    const { titulo, descricao, categoria, tipo = 'portfolio' } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    if (!titulo || !categoria) {
      return res.status(400).json({ error: 'Título e categoria são obrigatórios' });
    }

    // Processar imagem (comprimir e criar thumbnail)
    const outputDir = path.join(__dirname, '../../uploads/portfolio');
    const { imagemUrl, thumbUrl } = await processImage(
      req.file.path,
      outputDir,
      req.file.filename
    );

    // Salvar no banco de dados
    const foto = await prisma.galeria.create({
      data: {
        estabelecimentoId,
        titulo,
        descricao: descricao || null,
        categoria,
        tipo,
        imagemUrl,
        imagemThumbUrl: thumbUrl
      }
    });

    res.status(201).json({
      message: 'Foto adicionada ao portfólio com sucesso',
      foto
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da foto' });
  }
};

/**
 * Listar fotos do portfólio
 */
export const getFotos = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const { categoria, tipo, ativo = 'true' } = req.query;

    const where = {
      estabelecimentoId,
      ativo: ativo === 'true'
    };

    if (categoria) {
      where.categoria = categoria;
    }

    if (tipo) {
      where.tipo = tipo;
    }

    const fotos = await prisma.galeria.findMany({
      where,
      orderBy: [
        { ordem: 'asc' },
        { criadoEm: 'desc' }
      ]
    });

    res.json(fotos);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
};

/**
 * Obter estatísticas do portfólio
 */
export const getEstatisticas = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;

    const [total, porCategoria] = await Promise.all([
      prisma.galeria.count({
        where: { estabelecimentoId, ativo: true }
      }),
      prisma.galeria.groupBy({
        by: ['categoria'],
        where: { estabelecimentoId, ativo: true },
        _count: true
      })
    ]);

    const categorias = porCategoria.reduce((acc, item) => {
      acc[item.categoria] = item._count;
      return acc;
    }, {});

    res.json({
      total,
      categorias
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

/**
 * Atualizar foto do portfólio
 */
export const updateFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;
    const { titulo, descricao, categoria, tipo, ordem, ativo } = req.body;

    // Verificar se a foto existe e pertence ao estabelecimento
    const foto = await prisma.galeria.findUnique({
      where: { id }
    });

    if (!foto) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    if (foto.estabelecimentoId !== estabelecimentoId) {
      return res.status(403).json({ error: 'Sem permissão para editar esta foto' });
    }

    // Atualizar dados
    const updateData = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (tipo !== undefined) updateData.tipo = tipo;
    if (ordem !== undefined) updateData.ordem = parseInt(ordem);
    if (ativo !== undefined) updateData.ativo = ativo === 'true' || ativo === true;

    const fotoAtualizada = await prisma.galeria.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Foto atualizada com sucesso',
      foto: fotoAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    res.status(500).json({ error: 'Erro ao atualizar foto' });
  }
};

/**
 * Deletar foto do portfólio
 */
export const deleteFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const estabelecimentoId = req.user.id;

    // Verificar se a foto existe e pertence ao estabelecimento
    const foto = await prisma.galeria.findUnique({
      where: { id }
    });

    if (!foto) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    if (foto.estabelecimentoId !== estabelecimentoId) {
      return res.status(403).json({ error: 'Sem permissão para deletar esta foto' });
    }

    // Deletar arquivos físicos
    await deleteImage(foto.imagemUrl, foto.imagemThumbUrl);

    // Deletar do banco
    await prisma.galeria.delete({
      where: { id }
    });

    res.json({ message: 'Foto deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    res.status(500).json({ error: 'Erro ao deletar foto' });
  }
};

/**
 * Reordenar fotos
 */
export const reordenarFotos = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;
    const { ordenacao } = req.body; // Array de { id, ordem }

    if (!Array.isArray(ordenacao)) {
      return res.status(400).json({ error: 'Ordenação deve ser um array' });
    }

    // Atualizar ordem de cada foto
    await Promise.all(
      ordenacao.map(item =>
        prisma.galeria.updateMany({
          where: {
            id: item.id,
            estabelecimentoId
          },
          data: {
            ordem: item.ordem
          }
        })
      )
    );

    res.json({ message: 'Ordem atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao reordenar fotos:', error);
    res.status(500).json({ error: 'Erro ao reordenar fotos' });
  }
};

/**
 * Obter categorias disponíveis
 */
export const getCategorias = async (req, res) => {
  try {
    const categorias = [
      { value: 'cabelo', label: 'Cabelo', icon: '💇' },
      { value: 'barba', label: 'Barba', icon: '🧔' },
      { value: 'unha', label: 'Unha', icon: '💅' },
      { value: 'maquiagem', label: 'Maquiagem', icon: '💄' },
      { value: 'bronze', label: 'Bronzeamento', icon: '☀️' },
      { value: 'spa', label: 'Spa', icon: '🧖' },
      { value: 'depilacao', label: 'Depilação', icon: '✨' },
      { value: 'massagem', label: 'Massagem', icon: '💆' },
      { value: 'estetica', label: 'Estética', icon: '✨' },
      { value: 'outros', label: 'Outros', icon: '⭐' }
    ];

    res.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};


