import { useState, useEffect } from 'react'
import { FileText, Filter, Trash2, Eye } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import adminService from '../services/adminService'

const LogsAuditoria = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [filtros, setFiltros] = useState({ acao: '', entidade: '' })
  const [modalDetalhes, setModalDetalhes] = useState({ open: false, log: null })
  const [pagination, setPagination] = useState({ page: 1, limit: 50 })

  useEffect(() => {
    carregarLogs()
  }, [pagination.page, filtros])

  const carregarLogs = async () => {
    setLoading(true)
    try {
      const data = await adminService.getLogs({
        page: pagination.page,
        limit: pagination.limit,
        ...filtros
      })
      setLogs(data.logs)
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch (error) {
      console.error('Erro ao carregar logs:', error)
      setToast({ type: 'error', message: 'Erro ao carregar logs' })
    } finally {
      setLoading(false)
    }
  }

  const handleLimparLogs = async () => {
    if (!confirm('Tem certeza que deseja limpar logs com mais de 90 dias? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const result = await adminService.cleanOldLogs()
      setToast({ 
        type: 'success', 
        message: `${result.totalRemovido} logs removidos com sucesso` 
      })
      carregarLogs()
    } catch (error) {
      console.error('Erro ao limpar logs:', error)
      setToast({ type: 'error', message: 'Erro ao limpar logs' })
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getAcaoColor = (acao) => {
    if (acao.includes('CREATE')) return 'success'
    if (acao.includes('DELETE')) return 'danger'
    if (acao.includes('UPDATE') || acao.includes('CHANGE')) return 'warning'
    if (acao === 'LOGIN') return 'primary'
    return 'default'
  }

  const acoes = [...new Set(logs.map(log => log.acao))]
  const entidades = [...new Set(logs.map(log => log.entidade))]

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

      {/* Modal de Detalhes */}
      <Modal
        isOpen={modalDetalhes.open}
        onClose={() => setModalDetalhes({ open: false, log: null })}
        title="Detalhes do Log"
      >
        {modalDetalhes.log && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ação:</p>
              <Badge variant={getAcaoColor(modalDetalhes.log.acao)}>
                {modalDetalhes.log.acao}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entidade:</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {modalDetalhes.log.entidade}
              </p>
            </div>

            {modalDetalhes.log.entidadeId && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID da Entidade:</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {modalDetalhes.log.entidadeId}
                </code>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Administrador:</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {modalDetalhes.log.admin.nome} ({modalDetalhes.log.admin.email})
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data/Hora:</p>
              <p className="text-gray-900 dark:text-white">
                {formatDate(modalDetalhes.log.criadoEm)}
              </p>
            </div>

            {modalDetalhes.log.ipAddress && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IP Address:</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {modalDetalhes.log.ipAddress}
                </code>
              </div>
            )}

            {modalDetalhes.log.detalhes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Detalhes:</p>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(modalDetalhes.log.detalhes), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Logs de Auditoria
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Histórico completo de todas as ações administrativas
            </p>
          </div>
          <Button
            variant="danger"
            onClick={handleLimparLogs}
          >
            <Trash2 size={18} />
            Limpar Logs Antigos
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtrar por Ação:
              </label>
              <select
                value={filtros.acao}
                onChange={(e) => setFiltros(prev => ({ ...prev, acao: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas as ações</option>
                {acoes.map((acao) => (
                  <option key={acao} value={acao}>{acao}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtrar por Entidade:
              </label>
              <select
                value={filtros.entidade}
                onChange={(e) => setFiltros(prev => ({ ...prev, entidade: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas as entidades</option>
                {entidades.map((entidade) => (
                  <option key={entidade} value={entidade}>{entidade}</option>
                ))}
              </select>
            </div>

            {(filtros.acao || filtros.entidade) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFiltros({ acao: '', entidade: '' })}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Tabela de Logs */}
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
                        Data/Hora
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Ação
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Entidade
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Admin
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        IP Address
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(log.criadoEm)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getAcaoColor(log.acao)}>
                              {log.acao}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {log.entidade}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {log.admin.nome}
                          </td>
                          <td className="py-3 px-4">
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {log.ipAddress || 'N/A'}
                            </code>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setModalDetalhes({ open: true, log })}
                              >
                                <Eye size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                          Nenhum log encontrado
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

export default LogsAuditoria





















