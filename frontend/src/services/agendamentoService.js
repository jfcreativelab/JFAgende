import api from './api'

export const agendamentoService = {
  // Criar agendamento
  create: async (dados) => {
    const response = await api.post('/agendamentos', dados)
    return response.data
  },

  // Listar agendamentos do estabelecimento
  getByEstabelecimento: async (estabelecimentoId, filtros = {}) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/agendamentos/estabelecimento/${estabelecimentoId}?${params}`)
    return response.data
  },

  // Buscar horários disponíveis
  getHorariosDisponiveis: async (estabelecimentoId, servicoId, data) => {
    console.log('🔍 agendamentoService.getHorariosDisponiveis chamado com:', {
      estabelecimentoId,
      servicoId,
      data
    });
    
    try {
      const response = await api.get('/agendamentos/horarios-disponiveis', {
        params: { estabelecimentoId, servicoId, data }
      });
      
      console.log('✅ getHorariosDisponiveis resposta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro em getHorariosDisponiveis:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  },

  // Atualizar status
  updateStatus: async (id, status, formaPagamento = null) => {
    const dados = { status }
    if (formaPagamento) {
      dados.formaPagamento = formaPagamento
    }
    const response = await api.put(`/agendamentos/${id}`, dados)
    return response.data
  },

  // Cancelar agendamento
  cancel: async (id) => {
    const response = await api.delete(`/agendamentos/${id}`)
    return response.data
  },
}

export default agendamentoService

