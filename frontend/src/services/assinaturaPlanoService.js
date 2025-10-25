import api from './api';

const assinaturaPlanoService = {
  // Criar sessão de pagamento para assinatura
  async criarSessaoPagamento(planoId, clienteId) {
    try {
      const response = await api.post(`/assinatura-plano/${planoId}/criar-sessao`, {
        clienteId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sessão de pagamento:', error);
      throw error;
    }
  },

  // Listar assinaturas do cliente
  async getAssinaturasCliente(clienteId) {
    try {
      const response = await api.get(`/assinatura-plano/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
      throw error;
    }
  },

  // Cancelar assinatura
  async cancelarAssinatura(assinaturaId) {
    try {
      const response = await api.put(`/assinatura-plano/${assinaturaId}/cancelar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  },

  // Verificar status da assinatura
  async verificarStatusAssinatura(clienteId, estabelecimentoId) {
    try {
      const response = await api.get(`/assinatura-plano/status/${clienteId}/${estabelecimentoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      throw error;
    }
  },

  // Redirecionar para pagamento
  async assinarPlano(planoId, clienteId) {
    try {
      const { url } = await this.criarSessaoPagamento(planoId, clienteId);
      
      // Redirecionar para o Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
      throw error;
    }
  }
};

export default assinaturaPlanoService;
