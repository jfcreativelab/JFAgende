import api from './api';

const planoEstabelecimentoService = {
  // Listar planos de um estabelecimento
  async getPlanosByEstabelecimento(estabelecimentoId) {
    try {
      const response = await api.get(`/planos-estabelecimento/${estabelecimentoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      throw error;
    }
  },

  // Obter plano específico
  async getPlanoById(planoId) {
    try {
      const response = await api.get(`/planos-estabelecimento/plano/${planoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      throw error;
    }
  },

  // Criar novo plano
  async createPlano(estabelecimentoId, planoData) {
    try {
      const response = await api.post(`/planos-estabelecimento/${estabelecimentoId}`, planoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
  },

  // Atualizar plano
  async updatePlano(planoId, planoData) {
    try {
      const response = await api.put(`/planos-estabelecimento/${planoId}`, planoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      throw error;
    }
  },

  // Deletar plano
  async deletePlano(planoId) {
    try {
      const response = await api.delete(`/planos-estabelecimento/${planoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      throw error;
    }
  },

  // Reordenar planos
  async reordenarPlanos(estabelecimentoId, planos) {
    try {
      const response = await api.put(`/planos-estabelecimento/${estabelecimentoId}/reordenar`, { planos });
      return response.data;
    } catch (error) {
      console.error('Erro ao reordenar planos:', error);
      throw error;
    }
  },

  // Obter estatísticas dos planos
  async getEstatisticasPlanos(estabelecimentoId) {
    try {
      const response = await api.get(`/planos-estabelecimento/${estabelecimentoId}/estatisticas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Criar planos padrão para barbearia
  async criarPlanosPadrao(estabelecimentoId) {
    try {
      const planosPadrao = [
        {
          nome: 'Bronze',
          descricao: 'Ideal para quem quer estar sempre no estilo, sem pagar toda vez.',
          preco: 80,
          cor: 'from-amber-600 to-amber-800',
          icone: 'Crown',
          servicos: [
            '2 cortes de cabelo por mês',
            'Limpeza de sobrancelha'
          ],
          popular: false,
          ordem: 1
        },
        {
          nome: 'Prata',
          descricao: 'Perfeito para quem gosta de estar alinhado toda semana.',
          preco: 120,
          cor: 'from-gray-400 to-gray-600',
          icone: 'Star',
          servicos: [
            '2 cortes de cabelo + 2 barbas por mês',
            'Limpeza de sobrancelha',
            'Hidratante facial ou esfoliação (1x por mês)'
          ],
          popular: true,
          ordem: 2
        },
        {
          nome: 'Ouro',
          descricao: 'Para o cliente exigente que quer tratamento completo.',
          preco: 180,
          cor: 'from-yellow-500 to-yellow-700',
          icone: 'Zap',
          servicos: [
            '4 cortes de cabelo (1 por semana)',
            '4 barbas',
            'Hidratação capilar + massagem facial',
            'Limpeza de sobrancelha'
          ],
          popular: false,
          ordem: 3
        },
        {
          nome: 'Diamante',
          descricao: 'Plano exclusivo para clientes fiéis e que valorizam conforto e status.',
          preco: 280,
          cor: 'from-blue-500 to-purple-600',
          icone: 'Gem',
          servicos: [
            'Cortes e barbas ilimitados',
            'Limpeza de sobrancelha',
            'Hidratação + esfoliação facial'
          ],
          popular: false,
          ordem: 4
        }
      ];

      const promises = planosPadrao.map(plano => 
        this.createPlano(estabelecimentoId, plano)
      );

      const planosCriados = await Promise.all(promises);
      return planosCriados;
    } catch (error) {
      console.error('Erro ao criar planos padrão:', error);
      throw error;
    }
  }
};

export default planoEstabelecimentoService;
