import api from './api'

export const clienteService = {
  // Obter dados do cliente
  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  // Atualizar cliente
  update: async (id, dados) => {
    const response = await api.put(`/clientes/${id}`, dados)
    return response.data
  },

  // Listar agendamentos
  getAgendamentos: async (id) => {
    const response = await api.get(`/clientes/${id}/agendamentos`)
    return response.data
  },
}

export default clienteService

