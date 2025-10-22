import { useState, useEffect } from 'react'
import { Search, Trash2, Eye, User, Store as StoreIcon } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import adminService from '../services/adminService'

const GerenciarUsuarios = () => {
  const [abaAtiva, setAbaAtiva] = useState('clientes')
  const [clientes, setClientes] = useState([])
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [modalDelete, setModalDelete] = useState({ open: false, tipo: '', id: '', nome: '' })
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })

  useEffect(() => {
    carregarDados()
  }, [abaAtiva, pagination.page, search])

  const carregarDados = async () => {
    setLoading(true)
    try {
      if (abaAtiva === 'clientes') {
        const data = await adminService.getAllClientes({
          page: pagination.page,
          limit: pagination.limit,
          search
        })
        setClientes(data.clientes)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      } else {
        const data = await adminService.getAllEstabelecimentos({
          page: pagination.page,
          limit: pagination.limit,
          search
        })
        setEstabelecimentos(data.estabelecimentos)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      if (modalDelete.tipo === 'cliente') {
        await adminService.deleteCliente(modalDelete.id)
        setToast({ type: 'success', message: 'Cliente deletado com sucesso' })
      } else {
        await adminService.deleteEstabelecimento(modalDelete.id)
        setToast({ type: 'success', message: 'Estabelecimento deletado com sucesso' })
      }
      
      setModalDelete({ open: false, tipo: '', id: '', nome: '' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      setToast({ type: 'error', message: 'Erro ao deletar usuário' })
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

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

      {/* Modal de Confirmação */}
      <Modal
        isOpen={modalDelete.open}
        onClose={() => setModalDelete({ open: false, tipo: '', id: '', nome: '' })}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Tem certeza que deseja deletar <strong>{modalDelete.nome}</strong>?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
          </p>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setModalDelete({ open: false, tipo: '', id: '', nome: '' })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
            >
              <Trash2 size={18} />
              Deletar
            </Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Usuários
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>

        {/* Tabs e Busca */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => {
                  setAbaAtiva('clientes')
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  abaAtiva === 'clientes'
                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={18} />
                  Clientes
                </div>
              </button>
              <button
                onClick={() => {
                  setAbaAtiva('estabelecimentos')
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  abaAtiva === 'estabelecimentos'
                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <StoreIcon size={18} />
                  Estabelecimentos
                </div>
              </button>
            </div>

            {/* Busca */}
            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
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
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Email
                      </th>
                      {abaAtiva === 'estabelecimentos' && (
                        <>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Categoria
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Plano
                          </th>
                        </>
                      )}
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Agendamentos
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Cadastro
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {abaAtiva === 'clientes' ? (
                      clientes.length > 0 ? (
                        clientes.map((cliente) => (
                          <tr
                            key={cliente.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <User size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {cliente.nome}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {cliente.email}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="primary">
                                {cliente.totalAgendamentos}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(cliente.criadoEm)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setModalDelete({
                                    open: true,
                                    tipo: 'cliente',
                                    id: cliente.id,
                                    nome: cliente.nome
                                  })}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                            Nenhum cliente encontrado
                          </td>
                        </tr>
                      )
                    ) : (
                      estabelecimentos.length > 0 ? (
                        estabelecimentos.map((est) => (
                          <tr
                            key={est.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                  <StoreIcon size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {est.nome}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {est.email}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="default">
                                {est.categoria}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={
                                  est.plano === 'PREMIUM' ? 'success' :
                                  est.plano === 'BASIC' ? 'warning' : 'default'
                                }
                              >
                                {est.plano}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="primary">
                                {est.totalAgendamentos}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(est.criadoEm)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setModalDelete({
                                    open: true,
                                    tipo: 'estabelecimento',
                                    id: est.id,
                                    nome: est.nome
                                  })}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-gray-500 dark:text-gray-400">
                            Nenhum estabelecimento encontrado
                          </td>
                        </tr>
                      )
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

export default GerenciarUsuarios





















