import api from './api'

export const estatisticasService = {
  // Buscar estatísticas do estabelecimento
  get: async () => {
    try {
      const response = await api.get('/estatisticas')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      // Retorna dados padrão em caso de erro
      return {
        totalAgendamentos: 0,
        agendamentosMesAtual: 0,
        agendamentosMesAnterior: 0,
        crescimentoMensal: 0,
        agendamentosPorStatus: {
          PENDENTE: 0,
          CONFIRMADO: 0,
          CONCLUIDO: 0,
          CANCELADO: 0
        },
        receitaTotal: 0,
        mediaAvaliacoes: 0,
        totalAvaliacoes: 0,
        servicoMaisPopular: 'N/A'
      }
    }
  },

  // Buscar estatísticas gerais (públicas)
  getEstatisticas: async () => {
    try {
      const response = await api.get('/estatisticas/gerais')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error)
      // Retorna dados padrão em caso de erro
      return {
        totalEstabelecimentos: 0,
        totalAgendamentos: 0,
        totalAvaliacoes: 0,
        totalUsuariosAtivos: 0
      }
    }
  }
}

export default estatisticasService