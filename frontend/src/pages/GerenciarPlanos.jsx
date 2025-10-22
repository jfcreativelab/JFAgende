import { useState, useEffect } from 'react'
import { Search, Edit, X, Check, Crown } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import adminService from '../services/adminService'
import planoService from '../services/planoService'

const GerenciarPlanos = () => {
  const [assinaturas, setAssinaturas] = useState([])
  const [planos, setPlanos] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [modalPlano, setModalPlano] = useState({ open: false, assinatura: null })
  const [novoPlanoId, setNovoPlanoId] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })

  useEffect(() => {
    carregarDados()
    carregarPlanos()
  }, [pagination.page, search])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const data = await adminService.getAllAssinaturas({
        page: pagination.page,
        limit: pagination.limit
      })
      setAssinaturas(data.assinaturas)
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  const carregarPlanos = async () => {
    try {
      const data = await planoService.listarPlanos()
      setPlanos(data)
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
    }
  }

  const handleMudarPlano = async () => {
    if (!novoPlanoId || !modalPlano.assinatura) return

    try {
      await adminService.mudarPlano(modalPlano.assinatura.estabelecimentoId, novoPlanoId)
      setToast({ type: 'success', message: 'Plano alterado com sucesso' })
      setModalPlano({ open: false, assinatura: null })
      setNovoPlanoId('')
      carregarDados()
    } catch (error) {
      console.error('Erro ao mudar plano:', error)
      setToast({ type: 'error', message: 'Erro ao alterar plano' })
    }
  }

  const handleCancelarAssinatura = async (estabelecimentoId) => {
    if (!confirm('Tem certeza que deseja cancelar esta assinatura?')) return

    try {
      await adminService.cancelarAssinatura(estabelecimentoId)
      setToast({ type: 'success', message: 'Assinatura cancelada. Movido para plano FREE.' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      setToast({ type: 'error', message: 'Erro ao cancelar assinatura' })
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Permanente'
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const filteredAssinaturas = assinaturas.filter(ass =>
    ass.estabelecimento.nome.toLowerCase().includes(search.toLowerCase()) ||
    ass.estabelecimento.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Modal de Mudança de Plano */}
      <Modal
        isOpen={modalPlano.open}
        onClose={() => {
          setModalPlano({ open: false, assinatura: null })
          setNovoPlanoId('')
        }}
        title="Alterar Plano"
      >
        {modalPlano.assinatura && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Estabelecimento:
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {modalPlano.assinatura.estabelecimento.nome}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Plano Atual:
              </p>
              <Badge variant={
                modalPlano.assinatura.plano.nome === 'PREMIUM' ? 'success' :
                modalPlano.assinatura.plano.nome === 'BASIC' ? 'warning' : 'default'
              }>
                {modalPlano.assinatura.plano.nome}
              </Badge>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Novo Plano:
              </label>
              <select
                value={novoPlanoId}
                onChange={(e) => setNovoPlanoId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione um plano</option>
                {planos.map((plano) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.nome} - R$ {plano.preco.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setModalPlano({ open: false, assinatura: null })
                  setNovoPlanoId('')
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                onClick={handleMudarPlano}
                disabled={!novoPlanoId}
              >
                <Check size={18} />
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Planos e Assinaturas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e gerencie todas as assinaturas do sistema
          </p>
        </div>

        {/* Busca */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar estabelecimento..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Tabela */}
        <Card>
          {loading ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Estabelecimento
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Plano
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Preço/Mês
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Data Fim
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssinaturas.length > 0 ? (
                      filteredAssinaturas.map((ass) => (
                        <tr
                          key={ass.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {ass.estabelecimento.nome}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {ass.estabelecimento.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                ass.plano.nome === 'PREMIUM' ? 'success' :
                                ass.plano.nome === 'BASIC' ? 'warning' : 'default'
                              }
                            >
                              {ass.plano.nome === 'PREMIUM' && <Crown size={14} />}
                              {ass.plano.nome}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                            R$ {ass.plano.preco.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={ass.ativo ? 'success' : 'danger'}>
                              {ass.ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(ass.dataFim)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setModalPlano({ open: true, assinatura: ass })}
                              >
                                <Edit size={16} />
                              </Button>
                              {ass.plano.nome !== 'FREE' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleCancelarAssinatura(ass.estabelecimentoId)}
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                          Nenhuma assinatura encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Página {pagination.page} de {pagination.totalPages} ({pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}

export default GerenciarPlanos





















