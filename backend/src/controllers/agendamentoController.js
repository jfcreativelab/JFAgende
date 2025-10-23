import { PrismaClient } from '@prisma/client';
import whatsappService from '../services/whatsappService.js';

const prisma = new PrismaClient();

/**
 * Cria um novo agendamento
 */
export const createAgendamento = async (req, res) => {
  try {
    const { estabelecimentoId, servicoId, dataHora, observacoes, pagamentoAntecipado, valorTaxa, valorTotal } = req.body;
    const clienteId = req.user.id;

    console.log('🔍 Debug - Dados recebidos para criar agendamento:', {
      estabelecimentoId,
      servicoId,
      dataHora,
      observacoes,
      pagamentoAntecipado,
      valorTaxa,
      valorTotal,
      clienteId
    });

    if (!estabelecimentoId || !servicoId || !dataHora) {
      return res.status(400).json({ error: 'Estabelecimento, serviço e data/hora são obrigatórios' });
    }

    // Verifica se o serviço pertence ao estabelecimento
    const servico = await prisma.servico.findFirst({
      where: {
        id: servicoId,
        estabelecimentoId,
        ativo: true
      }
    });

    if (!servico) {
      return res.status(400).json({ error: 'Serviço não encontrado ou inativo' });
    }

    // Verifica se já existe um agendamento nesse horário
    // Mas permite agendamentos com pagamento antecipado (PIX)
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        estabelecimentoId,
        dataHora: new Date(dataHora),
        status: {
          in: ['PENDENTE', 'CONFIRMADO']
        },
        // Se for pagamento antecipado, não verificar conflito
        ...(req.body.pagamentoAntecipado ? {} : {})
      }
    });

    // Só bloqueia se não for pagamento antecipado
    if (agendamentoExistente && !req.body.pagamentoAntecipado) {
      return res.status(400).json({ error: 'Horário já está ocupado' });
    }

    // Cria o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId,
        estabelecimentoId,
        servicoId,
        dataHora: new Date(dataHora),
        observacoes,
        // Campos de pagamento PIX
        pagamentoAntecipado: req.body.pagamentoAntecipado || false,
        valorTaxa: req.body.valorTaxa || null,
        valorTotal: req.body.valorTotal || null,
        status: req.body.pagamentoAntecipado ? 'AGUARDANDO_APROVACAO_PAGAMENTO' : 'PENDENTE'
      },
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true
          }
        },
        estabelecimento: {
          select: {
            nome: true,
            endereco: true
          }
        },
        servico: {
          select: {
            nome: true,
            duracaoMin: true,
            preco: true
          }
        }
      }
    });

    console.log('🔍 Debug - Agendamento criado com sucesso:', {
      id: agendamento.id,
      status: agendamento.status,
      pagamentoAntecipado: agendamento.pagamentoAntecipado
    });

    // Enviar confirmação via WhatsApp (apenas se não for pagamento antecipado)
    if (!req.body.pagamentoAntecipado) {
      try {
        const whatsappData = {
          clienteNome: agendamento.cliente.nome,
          clienteTelefone: agendamento.cliente.telefone,
          estabelecimentoNome: agendamento.estabelecimento.nome,
          servicoNome: agendamento.servico.nome,
          dataHora: agendamento.dataHora,
          observacoes: agendamento.observacoes,
          enderecoEstabelecimento: agendamento.estabelecimento.endereco
        };

        console.log('📱 Enviando confirmação WhatsApp...');
        const whatsappResult = await whatsappService.sendAppointmentConfirmation(whatsappData);
        
        if (whatsappResult.success) {
          console.log('✅ Confirmação WhatsApp enviada com sucesso');
        } else {
          console.log('⚠️ Erro ao enviar confirmação WhatsApp:', whatsappResult.error);
        }
      } catch (whatsappError) {
        console.error('❌ Erro ao enviar confirmação WhatsApp:', whatsappError);
        // Não falha o agendamento se o WhatsApp falhar
      }
    }

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};

/**
 * Lista agendamentos de um estabelecimento
 */
export const getAgendamentosByEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, data } = req.query;

    // Verifica se o estabelecimento está acessando seus próprios agendamentos
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const where = { estabelecimentoId: id };

    if (status) {
      where.status = status;
    }

    if (data) {
      const dataInicio = new Date(data);
      const dataFim = new Date(data);
      dataFim.setHours(23, 59, 59, 999);

      where.dataHora = {
        gte: dataInicio,
        lte: dataFim
      };
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
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

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

/**
 * Atualiza status de um agendamento
 */
export const updateAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, formaPagamento } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const statusValidos = ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    // Se estiver marcando como CONCLUIDO, forma de pagamento é obrigatória
    if (status === 'CONCLUIDO' && !formaPagamento) {
      return res.status(400).json({ error: 'Forma de pagamento é obrigatória para agendamentos concluídos' });
    }

    // Valida forma de pagamento se fornecida
    if (formaPagamento) {
      const formasValidas = ['DINHEIRO', 'DEBITO', 'CREDITO', 'PIX'];
      if (!formasValidas.includes(formaPagamento)) {
        return res.status(400).json({ error: 'Forma de pagamento inválida' });
      }
    }

    // Busca o agendamento
    const agendamento = await prisma.agendamento.findUnique({
      where: { id }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verifica permissões
    const isCliente = req.user.tipo === 'cliente' && req.user.id === agendamento.clienteId;
    const isEstabelecimento = req.user.tipo === 'estabelecimento' && req.user.id === agendamento.estabelecimentoId;

    if (!isCliente && !isEstabelecimento) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Prepara dados para atualização
    const dadosAtualizacao = { status };
    if (formaPagamento) {
      dadosAtualizacao.formaPagamento = formaPagamento;
    }

    // Atualiza o agendamento
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id },
      data: dadosAtualizacao,
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true
          }
        },
        estabelecimento: {
          select: {
            nome: true
          }
        },
        servico: {
          select: {
            nome: true,
            preco: true
          }
        }
      }
    });

    res.json({
      message: 'Agendamento atualizado com sucesso',
      agendamento: agendamentoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

/**
 * Cancela um agendamento
 */
export const cancelAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o agendamento
    const agendamento = await prisma.agendamento.findUnique({
      where: { id }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verifica permissões
    const isCliente = req.user.tipo === 'cliente' && req.user.id === agendamento.clienteId;
    const isEstabelecimento = req.user.tipo === 'estabelecimento' && req.user.id === agendamento.estabelecimentoId;

    if (!isCliente && !isEstabelecimento) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Cancela o agendamento
    await prisma.agendamento.update({
      where: { id },
      data: { status: 'CANCELADO' }
    });

    res.json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
};

/**
 * Busca horários disponíveis para agendamento
 */
export const getHorariosDisponiveis = async (req, res) => {
  try {
    const { estabelecimentoId, servicoId, data } = req.query;

    if (!estabelecimentoId || !servicoId || !data) {
      return res.status(400).json({ error: 'Estabelecimento, serviço e data são obrigatórios' });
    }

    // Busca o serviço para obter a duração
    const servico = await prisma.servico.findUnique({
      where: { id: servicoId }
    });

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Busca os horários de funcionamento
    const dataObj = new Date(data);
    const diaSemana = dataObj.getDay();

    const horarioFuncionamento = await prisma.horario.findFirst({
      where: {
        estabelecimentoId,
        diaSemana,
        ativo: true
      }
    });

    if (!horarioFuncionamento) {
      return res.json({ horariosDisponiveis: [] });
    }

    // Busca agendamentos já marcados para o dia
    const dataInicio = new Date(data);
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const agendamentosOcupados = await prisma.agendamento.findMany({
      where: {
        estabelecimentoId,
        dataHora: {
          gte: dataInicio,
          lte: dataFim
        },
        status: {
          in: ['PENDENTE', 'CONFIRMADO']
        }
      },
      select: {
        dataHora: true
      }
    });

    // Gera lista de horários disponíveis (simplificado)
    const horariosOcupados = agendamentosOcupados.map(a => a.dataHora.toISOString());

    res.json({
      horarioFuncionamento,
      duracaoServico: servico.duracaoMin,
      horariosOcupados
    });
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
  }
};

