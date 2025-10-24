import { useState, useEffect } from 'react'
import { 
  Search, 
  Trash2, 
  Eye, 
  User, 
  Store as StoreIcon, 
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Edit,
  Shield,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Crown,
  Zap,
  Users2,
  Building2,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import AdminTable from '../components/AdminTable'
import AdminMetricCard from '../components/AdminMetricCard'
import AdminChart from '../components/AdminChart'
import AnimatedNumber from '../components/AnimatedNumber'
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
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEstabelecimentos: 0,
    clientesAtivos: 0,
    estabelecimentosAtivos: 0,
    crescimentoClientes: 0,
    crescimentoEstabelecimentos: 0
  })
  const [filtros, setFiltros] = useState({
    status: '',
    plano: '',
    dataInicio: '',
    dataFim: ''
  })
  const [viewMode, setViewMode] = useState('table') // table, cards, analytics

  useEffect(() => {
    carregarDados()
  }, [abaAtiva, pagination.page, search, filtros])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      
      if (abaAtiva === 'clientes') {
        // Buscar dados reais de clientes
        const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/clientes?page=${pagination.page}&limit=${pagination.limit}&search=${search}&${new URLSearchParams(filtros).toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setClientes(data.clientes || [])
          setPagination(prev => ({ 
            ...prev, 
            total: data.total || 0,
            totalPages: Math.ceil((data.total || 0) / pagination.limit)
          }))
        } else {
          // Fallback para dados simulados
          const data = await adminService.getAllClientes({
            page: pagination.page,
            limit: pagination.limit,
            search,
            ...filtros
          })
          setClientes(data.clientes)
          setPagination(prev => ({ ...prev, ...data.pagination }))
        }
      } else {
        // Buscar dados reais de estabelecimentos
        const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/estabelecimentos?page=${pagination.page}&limit=${pagination.limit}&search=${search}&${new URLSearchParams(filtros).toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setEstabelecimentos(data.estabelecimentos || [])
          setPagination(prev => ({ 
            ...prev, 
            total: data.total || 0,
            totalPages: Math.ceil((data.total || 0) / pagination.limit)
          }))
        } else {
          // Fallback para dados simulados
          const data = await adminService.getAllEstabelecimentos({
            page: pagination.page,
            limit: pagination.limit,
            search,
            ...filtros
          })
          setEstabelecimentos(data.estabelecimentos)
          setPagination(prev => ({ ...prev, ...data.pagination }))
        }
      }

      // Carregar estatísticas
      await carregarEstatisticas()
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  const carregarEstatisticas = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://jfagende-production.up.railway.app/api/admin/estatisticas-usuarios', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
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

  const handleExport = async (formato) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/exportar-usuarios?tipo=${abaAtiva}&formato=${formato}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `usuarios_${abaAtiva}_${new Date().toISOString().split('T')[0]}.${formato}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setToast({ type: 'success', message: 'Exportação realizada com sucesso' })
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      setToast({ type: 'error', message: 'Erro ao exportar dados' })
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      ativo: { color: 'green', text: 'Ativo' },
      inativo: { color: 'gray', text: 'Inativo' },
      pendente: { color: 'yellow', text: 'Pendente' },
      bloqueado: { color: 'red', text: 'Bloqueado' }
    }

    const config = statusConfig[status] || { color: 'gray', text: status }
    
    return (
      <Badge 
        className={`text-${config.color}-600 bg-${config.color}-100 dark:text-${config.color}-400 dark:bg-${config.color}-900/20`}
        size="sm"
      >
        {config.text}
      </Badge>
    )
  }

  const getPlanoBadge = (plano) => {
    const planoConfig = {
      FREE: { color: 'gray', text: 'FREE', icon: User },
      BASIC: { color: 'blue', text: 'BASIC', icon: Star },
      PREMIUM: { color: 'purple', text: 'PREMIUM', icon: Crown }
    }

    const config = planoConfig[plano] || { color: 'gray', text: plano, icon: User }
    const Icon = config.icon
    
    return (
      <Badge 
        className={`text-${config.color}-600 bg-${config.color}-100 dark:text-${config.color}-400 dark:bg-${config.color}-900/20 flex items-center gap-1`}
        size="sm"
      >
        <Icon size={12} />
        {config.text}
      </Badge>
    )
  }

  const columnsClientes = [
    { key: 'nome', label: 'Nome', render: (value, item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <User size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>
        </div>
      </div>
    )},
    { key: 'telefone', label: 'Telefone' },
    { key: 'totalAgendamentos', label: 'Agendamentos', render: (value) => (
      <Badge variant="primary" size="sm">
        {value}
      </Badge>
    )},
    { key: 'criadoEm', label: 'Cadastro', render: (value) => formatDate(value) },
    { key: 'status', label: 'Status', render: (value) => getStatusBadge(value) }
  ]

  const columnsEstabelecimentos = [
    { key: 'nome', label: 'Estabelecimento', render: (value, item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <StoreIcon size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>
        </div>
      </div>
    )},
    { key: 'categoria', label: 'Categoria', render: (value) => (
      <Badge variant="default" size="sm">
        {value}
      </Badge>
    )},
    { key: 'plano', label: 'Plano', render: (value) => getPlanoBadge(value) },
    { key: 'totalAgendamentos', label: 'Agendamentos', render: (value) => (
      <Badge variant="primary" size="sm">
        {value}
      </Badge>
    )},
    { key: 'criadoEm', label: 'Cadastro', render: (value) => formatDate(value) },
    { key: 'status', label: 'Status', render: (value) => getStatusBadge(value) }
  ]

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total de Clientes"
          value={stats.totalClientes}
          change={stats.crescimentoClientes}
          changeType="positive"
          icon={Users2}
          color="blue"
          subtitle={`${stats.clientesAtivos} ativos`}
        />
        
        <AdminMetricCard
          title="Estabelecimentos"
          value={stats.totalEstabelecimentos}
          change={stats.crescimentoEstabelecimentos}
          changeType="positive"
          icon={Building2}
          color="purple"
          subtitle={`${stats.estabelecimentosAtivos} ativos`}
        />
        
        <AdminMetricCard
          title="Taxa de Ativação"
          value={`${Math.round((stats.clientesAtivos / Math.max(stats.totalClientes, 1)) * 100)}%`}
          change="5.2"
          changeType="positive"
          icon={Activity}
          color="green"
          subtitle="Clientes ativos"
        />
        
        <AdminMetricCard
          title="Crescimento Total"
          value={`${Math.round(((stats.crescimentoClientes + stats.crescimentoEstabelecimentos) / 2) * 100) / 100}%`}
          change="12.8"
          changeType="positive"
          icon={TrendingUp}
          color="yellow"
          subtitle="Este mês"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Crescimento de Usuários"
          type="line"
          color="blue"
          data={[
            { x: 0, y: 100, label: 'Jan' },
            { x: 1, y: 150, label: 'Fev' },
            { x: 2, y: 200, label: 'Mar' },
            { x: 3, y: 180, label: 'Abr' },
            { x: 4, y: 250, label: 'Mai' },
            { x: 5, y: 300, label: 'Jun' }
          ]}
          trendValue={15.2}
          trendType="positive"
        />
        
        <AdminChart
          title="Distribuição por Plano"
          type="pie"
          color="purple"
          data={[
            { x: 0, y: 40, label: 'FREE' },
            { x: 1, y: 35, label: 'BASIC' },
            { x: 2, y: 25, label: 'PREMIUM' }
          ]}
        />
      </div>
    </div>
  )

  const renderFiltros = () => (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtros Avançados
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltros({ status: '', plano: '', dataInicio: '', dataFim: '' })}
          >
            Limpar Filtros
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
          
          {abaAtiva === 'estabelecimentos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plano
              </label>
              <select
                value={filtros.plano}
                onChange={(e) => setFiltros({ ...filtros, plano: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos os planos</option>
                <option value="FREE">FREE</option>
                <option value="BASIC">BASIC</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </Card>
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
        {/* Header Ultra Profissional */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
        <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gerenciar Usuários
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Controle total de clientes e estabelecimentos
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Sistema Online
                </span>
              </div>
              
              <Button
                onClick={carregarDados}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RefreshCw size={16} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs e Controles */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Tabs */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => {
                  setAbaAtiva('clientes')
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  abaAtiva === 'clientes'
                      ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={18} />
                  Clientes
                    <Badge variant="primary" size="sm" className="ml-1">
                      {stats.totalClientes}
                    </Badge>
                </div>
              </button>
              <button
                onClick={() => {
                  setAbaAtiva('estabelecimentos')
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  abaAtiva === 'estabelecimentos'
                      ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <StoreIcon size={18} />
                  Estabelecimentos
                    <Badge variant="primary" size="sm" className="ml-1">
                      {stats.totalEstabelecimentos}
                    </Badge>
                </div>
                </button>
              </div>

              {/* Controles */}
              <div className="flex items-center gap-3">
                {/* Modo de Visualização */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'table' 
                        ? 'bg-white dark:bg-gray-800 shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'cards' 
                        ? 'bg-white dark:bg-gray-800 shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <PieChart size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('analytics')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'analytics' 
                        ? 'bg-white dark:bg-gray-800 shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Activity size={16} />
              </button>
            </div>

            {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Exportar */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleExport('csv')}
                    variant="outline"
                    size="sm"
                    className="hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Download size={16} />
                    CSV
                  </Button>
                  <Button
                    onClick={() => handleExport('excel')}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Download size={16} />
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Filtros */}
        {renderFiltros()}

        {/* Conteúdo Principal */}
        {viewMode === 'analytics' ? (
          renderAnalytics()
        ) : (
          <AdminTable
            title={`${abaAtiva === 'clientes' ? 'Clientes' : 'Estabelecimentos'} Cadastrados`}
            data={abaAtiva === 'clientes' ? clientes : estabelecimentos}
            columns={abaAtiva === 'clientes' ? columnsClientes : columnsEstabelecimentos}
            searchable={false}
            filterable={false}
            actions={true}
            pagination={true}
            pageSize={pagination.limit}
            onEdit={(item) => console.log('Editar:', item)}
            onDelete={(item) => setModalDelete({
                                    open: true,
              tipo: abaAtiva === 'clientes' ? 'cliente' : 'estabelecimento',
              id: item.id,
              nome: item.nome
            })}
            onView={(item) => console.log('Ver:', item)}
            onExport={() => handleExport('csv')}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default GerenciarUsuarios