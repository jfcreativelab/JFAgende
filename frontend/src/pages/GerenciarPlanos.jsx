import { useState, useEffect } from 'react'
import { 
  Search, 
  Edit, 
  X, 
  Check, 
  Crown, 
  Star,
  User,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  MoreVertical,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import AdminTable from '../components/AdminTable'
import AdminMetricCard from '../components/AdminMetricCard'
import AdminChart from '../components/AdminChart'
import AnimatedNumber from '../components/AnimatedNumber'
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
  const [stats, setStats] = useState({
    totalAssinaturas: 0,
    receitaMensal: 0,
    crescimentoReceita: 0,
    planosAtivos: 0,
    conversaoGratuito: 0,
    churnRate: 0
  })
  const [filtros, setFiltros] = useState({
    status: '',
    plano: '',
    dataInicio: '',
    dataFim: ''
  })
  const [viewMode, setViewMode] = useState('table') // table, analytics, planos

  useEffect(() => {
    carregarDados()
    carregarPlanos()
  }, [pagination.page, search, filtros])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const data = await adminService.getAllAssinaturas({
        page: pagination.page,
        limit: pagination.limit,
        search,
        ...filtros
      })
      setAssinaturas(data.assinaturas)
      setPagination(prev => ({ ...prev, ...data.pagination }))
      
      // Carregar estatísticas
      await carregarEstatisticas()
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

  const carregarEstatisticas = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://jfagende-production.up.railway.app/api/admin/estatisticas-planos', {
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

  const handleExport = async (formato) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/exportar-assinaturas?formato=${formato}`, {
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
        a.download = `assinaturas_${new Date().toISOString().split('T')[0]}.${formato}`
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
    if (!date) return 'Permanente'
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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

  const getStatusBadge = (ativo) => {
    return (
      <Badge 
        className={ativo ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'}
        size="sm"
      >
        {ativo ? 'Ativo' : 'Inativo'}
      </Badge>
    )
  }

  const columnsAssinaturas = [
    { key: 'estabelecimento', label: 'Estabelecimento', render: (value, item) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{item.estabelecimento.nome}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.estabelecimento.email}</p>
      </div>
    )},
    { key: 'plano', label: 'Plano', render: (value, item) => getPlanoBadge(item.plano.nome) },
    { key: 'preco', label: 'Preço/Mês', render: (value, item) => (
      <span className="font-semibold text-gray-900 dark:text-white">
        R$ {item.plano.preco.toFixed(2)}
      </span>
    )},
    { key: 'status', label: 'Status', render: (value, item) => getStatusBadge(item.ativo) },
    { key: 'dataFim', label: 'Data Fim', render: (value, item) => formatDate(item.dataFim) },
    { key: 'criadoEm', label: 'Criado em', render: (value, item) => formatDate(item.criadoEm) }
  ]

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total de Assinaturas"
          value={stats.totalAssinaturas}
          change={stats.crescimentoReceita}
          changeType="positive"
          icon={Crown}
          color="purple"
          subtitle="Planos ativos"
        />
        
        <AdminMetricCard
          title="Receita Mensal"
          value={`R$ ${stats.receitaMensal.toLocaleString()}`}
          change={stats.crescimentoReceita}
          changeType="positive"
          icon={DollarSign}
          color="green"
          subtitle="Este mês"
        />
        
        <AdminMetricCard
          title="Taxa de Conversão"
          value={`${stats.conversaoGratuito}%`}
          change="2.5"
          changeType="positive"
          icon={TrendingUp}
          color="blue"
          subtitle="FREE → PAGO"
        />
        
        <AdminMetricCard
          title="Churn Rate"
          value={`${stats.churnRate}%`}
          change="-1.2"
          changeType="negative"
          icon={TrendingDown}
          color="red"
          subtitle="Cancelamentos"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Receita por Plano"
          type="bar"
          color="green"
          data={[
            { x: 0, y: 15000, label: 'FREE' },
            { x: 1, y: 25000, label: 'BASIC' },
            { x: 2, y: 40000, label: 'PREMIUM' }
          ]}
          trendValue={18.5}
          trendType="positive"
        />
        
        <AdminChart
          title="Distribuição de Planos"
          type="pie"
          color="purple"
          data={[
            { x: 0, y: 40, label: 'FREE' },
            { x: 1, y: 35, label: 'BASIC' },
            { x: 2, y: 25, label: 'PREMIUM' }
          ]}
        />
      </div>

      {/* Top Estabelecimentos */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Estabelecimentos por Receita
          </h3>
          <div className="space-y-4">
            {assinaturas.slice(0, 5).map((assinatura, index) => (
              <div key={assinatura.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {assinatura.estabelecimento.nome}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {assinatura.plano.nome} • {assinatura.ativo ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    R$ {assinatura.plano.preco.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    por mês
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )

  const renderPlanos = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card key={plano.id} className={`relative overflow-hidden ${
            plano.nome === 'PREMIUM' ? 'ring-2 ring-purple-500' : ''
          }`}>
            {plano.nome === 'PREMIUM' && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                MAIS POPULAR
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {plano.nome === 'FREE' && <User className="text-gray-500" size={24} />}
                  {plano.nome === 'BASIC' && <Star className="text-blue-500" size={24} />}
                  {plano.nome === 'PREMIUM' && <Crown className="text-purple-500" size={24} />}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plano.nome}
                  </h3>
                </div>
                <Badge 
                  variant={plano.nome === 'PREMIUM' ? 'success' : plano.nome === 'BASIC' ? 'warning' : 'default'}
                  size="sm"
                >
                  {plano.nome}
                </Badge>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    R$ {plano.preco.toFixed(2)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {plano.descricao}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {plano.caracteristicas?.map((caracteristica, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {caracteristica}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {assinaturas.filter(a => a.plano.nome === plano.nome).length} estabelecimentos
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        plano.nome === 'FREE' ? 'bg-gray-400' :
                        plano.nome === 'BASIC' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (assinaturas.filter(a => a.plano.nome === plano.nome).length / Math.max(assinaturas.length, 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plano
            </label>
            <select
              value={filtros.plano}
              onChange={(e) => setFiltros({ ...filtros, plano: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os planos</option>
              <option value="FREE">FREE</option>
              <option value="BASIC">BASIC</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              {getPlanoBadge(modalPlano.assinatura.plano.nome)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Novo Plano:
              </label>
              <select
                value={novoPlanoId}
                onChange={(e) => setNovoPlanoId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Check size={18} />
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <div className="space-y-6">
        {/* Header Ultra Profissional */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
        <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Gerenciar Planos e Assinaturas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Controle total de planos e receita da plataforma
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
                className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <RefreshCw size={16} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              {/* Modo de Visualização */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'analytics' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Activity size={16} />
                </button>
                <button
                  onClick={() => setViewMode('planos')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'planos' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Crown size={16} />
                </button>
              </div>

              {/* Busca e Exportar */}
              <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar estabelecimento..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

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
        ) : viewMode === 'planos' ? (
          renderPlanos()
        ) : (
          <AdminTable
            title="Assinaturas Ativas"
            data={assinaturas}
            columns={columnsAssinaturas}
            searchable={false}
            filterable={false}
            actions={true}
            pagination={true}
            pageSize={pagination.limit}
            onEdit={(item) => setModalPlano({ open: true, assinatura: item })}
            onDelete={(item) => handleCancelarAssinatura(item.estabelecimentoId)}
            onView={(item) => console.log('Ver:', item)}
            onExport={() => handleExport('csv')}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default GerenciarPlanos
