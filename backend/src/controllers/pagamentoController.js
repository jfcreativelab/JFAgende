import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sharp from 'sharp';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Taxa da plataforma
const TAXA_PLATAFORMA = 5.00;

/**
 * Gerar QR Code para pagamento PIX
 */
export const gerarQrCodePix = async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    const clienteId = req.user.id;

    // Buscar agendamento
    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id: agendamentoId,
        clienteId: clienteId
      },
      include: {
        servico: true,
        estabelecimento: {
          select: {
            chavePix: true,
            nome: true
          }
        }
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (!agendamento.estabelecimento.chavePix) {
      return res.status(400).json({ error: 'Estabelecimento não possui chave PIX cadastrada' });
    }

    // Calcular valores
    const valorServico = agendamento.servico.preco;
    const valorTaxa = TAXA_PLATAFORMA;
    const valorTotal = valorServico + valorTaxa;

    // Gerar dados do PIX
    const pixData = {
      chavePix: agendamento.estabelecimento.chavePix,
      valor: valorTotal,
      descricao: `JFAgende - ${agendamento.servico.nome} - ${agendamento.estabelecimento.nome}`,
      estabelecimento: agendamento.estabelecimento.nome,
      servico: agendamento.servico.nome,
      dataHora: agendamento.dataHora,
      valorServico: valorServico,
      valorTaxa: valorTaxa,
      valorTotal: valorTotal
    };

    // Gerar QR Code real
    const qrCodeData = `pix://copiaecola?chave=${pixData.chavePix}&valor=${pixData.valor.toFixed(2)}&txid=${agendamento.id}`;
    
    try {
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      res.json({
        success: true,
        pixData,
        qrCodeData,
        qrCodeImage,
        message: 'QR Code PIX gerado com sucesso'
      });
    } catch (qrError) {
      console.error('Erro ao gerar QR Code:', qrError);
      // Fallback: retornar dados sem QR Code
      res.json({
        success: true,
        pixData,
        qrCodeData,
        qrCodeImage: null,
        message: 'Dados do PIX gerados (QR Code não disponível)'
      });
    }

  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code PIX' });
  }
};

/**
 * Upload de comprovante PIX
 */
export const uploadComprovantePix = async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    const clienteId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Comprovante é obrigatório' });
    }

    // Buscar agendamento
    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id: agendamentoId,
        clienteId: clienteId
      },
      include: {
        servico: true
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Processar imagem
    const filename = `comprovante_${agendamentoId}_${Date.now()}.webp`;
    const uploadPath = path.join(__dirname, '../../uploads/comprovantes');
    
    // Criar diretório se não existir
    await fs.mkdir(uploadPath, { recursive: true });
    
    const filePath = path.join(uploadPath, filename);

    // Otimizar imagem
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    // Calcular valores
    const valorServico = agendamento.servico.preco;
    const valorTaxa = TAXA_PLATAFORMA;
    const valorTotal = valorServico + valorTaxa;

    // Atualizar agendamento
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: {
        id: agendamentoId
      },
      data: {
        pagamentoAntecipado: true,
        comprovantePix: `/uploads/comprovantes/${filename}`,
        valorTaxa: valorTaxa,
        valorTotal: valorTotal,
        status: 'PENDENTE_PAGAMENTO' // Aguardando confirmação do pagamento
      },
      include: {
        servico: true,
        estabelecimento: {
          select: {
            nome: true,
            chavePix: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Comprovante enviado com sucesso! Aguarde a confirmação do pagamento.',
      agendamento: agendamentoAtualizado
    });

  } catch (error) {
    console.error('Erro ao fazer upload do comprovante:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do comprovante' });
  }
};

/**
 * Confirmar pagamento PIX (para estabelecimento)
 */
export const confirmarPagamentoPix = async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    const estabelecimentoId = req.user.id;

    // Buscar agendamento
    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id: agendamentoId,
        estabelecimentoId: estabelecimentoId,
        pagamentoAntecipado: true,
        status: 'PENDENTE_PAGAMENTO'
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou já processado' });
    }

    // Atualizar status do agendamento
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: {
        id: agendamentoId
      },
      data: {
        status: 'CONFIRMADO',
        formaPagamento: 'PIX'
      },
      include: {
        servico: true,
        cliente: {
          select: {
            nome: true,
            telefone: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Pagamento confirmado com sucesso!',
      agendamento: agendamentoAtualizado
    });

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({ error: 'Erro ao confirmar pagamento' });
  }
};

/**
 * Rejeitar pagamento PIX (para estabelecimento)
 */
export const rejeitarPagamentoPix = async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    const { motivo } = req.body;
    const estabelecimentoId = req.user.id;

    // Buscar agendamento
    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id: agendamentoId,
        estabelecimentoId: estabelecimentoId,
        pagamentoAntecipado: true,
        status: 'PENDENTE_PAGAMENTO'
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou já processado' });
    }

    // Atualizar status do agendamento
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: {
        id: agendamentoId
      },
      data: {
        status: 'CANCELADO',
        observacoes: motivo ? `Pagamento rejeitado: ${motivo}` : 'Pagamento rejeitado'
      },
      include: {
        servico: true,
        cliente: {
          select: {
            nome: true,
            telefone: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Pagamento rejeitado',
      agendamento: agendamentoAtualizado
    });

  } catch (error) {
    console.error('Erro ao rejeitar pagamento:', error);
    res.status(500).json({ error: 'Erro ao rejeitar pagamento' });
  }
};

/**
 * Listar pagamentos pendentes (para estabelecimento)
 */
export const listarPagamentosPendentes = async (req, res) => {
  try {
    const estabelecimentoId = req.user.id;

    const pagamentosPendentes = await prisma.agendamento.findMany({
      where: {
        estabelecimentoId: estabelecimentoId,
        pagamentoAntecipado: true,
        status: 'PENDENTE_PAGAMENTO'
      },
      include: {
        servico: true,
        cliente: {
          select: {
            nome: true,
            telefone: true,
            email: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    res.json(pagamentosPendentes);

  } catch (error) {
    console.error('Erro ao listar pagamentos pendentes:', error);
    res.status(500).json({ error: 'Erro ao listar pagamentos pendentes' });
  }
};