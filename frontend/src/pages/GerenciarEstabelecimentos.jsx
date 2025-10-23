import { useState, useEffect } from 'react'
import { 
  Search, 
  Trash2, 
  Eye, 
  Edit,
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  Crown,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Settings,
  Award,
  Target,
  Globe,
  Camera,
  Image as ImageIcon,
  FileText,
  ExternalLink
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

const GerenciarEstabelecimentos = () => {
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [modalDelete, setModalDelete] = useState({ open: false, id: '', nome: '' })
  const [modalDetalhes, setModalDetalhes] = useState({ open: false, estabelecimento: null })
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })
  const [stats, setStats] = useState({
    totalEstabelecimentos: 0,
    estabelecimentosAtivos: 0,
    estabelecimentosPendentes: 0,
    receitaTotal: 0,
    crescimentoEstabelecimentos: 0,
    topCategoria: '',
    mediaAvaliacao: 0,
    totalAgendamentos: 0
  })
  const [filtros, setFiltros] = useState({
    status: '',
    categoria: '',
    plano: '',
    avaliacao: '',
    dataInicio: '',
    dataFim: ''
  })
  const [viewMode, setViewMode] = useState('table') // table, cards, analytics, map

  useEffect(() => {
    carregarDados()
  }, [pagination.page, search, filtros])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const data = await adminService.getAllEstabelecimentos({
        page: pagination.page,
        limit: pagination.limit,
        search,
        ...filtros
      })
      setEstabelecimentos(data.estabelecimentos)
      setPagination(prev => ({ ...prev, ...data.pagination }))
      
      // Carregar estatísticas
      await carregarEstatisticas()
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  const carregarEstatisticas = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://jfagende-production.up.railway.app/api/admin/estatisticas-estabelecimentos', {
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
      await adminService.deleteEstabelecimento(modalDelete.id)
      setToast({ type: 'success', message: 'Estabelecimento deletado com sucesso' })
      setModalDelete({ open: false, id: '', nome: '' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      setToast({ type: 'error', message: 'Erro ao deletar estabelecimento' })
    }
  }

  const handleAprovar = async (id) => {
    try {
      await adminService.aprovarEstabelecimento(id)
      setToast({ type: 'success', message: 'Estabelecimento aprovado com sucesso' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao aprovar:', error)
      setToast({ type: 'error', message: 'Erro ao aprovar estabelecimento' })
    }
  }

  const handleRejeitar = async (id) => {
    try {
      await adminService.rejeitarEstabelecimento(id)
      setToast({ type: 'success', message: 'Estabelecimento rejeitado' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao rejeitar:', error)
      setToast({ type: 'error', message: 'Erro ao rejeitar estabelecimento' })
    }
  }

  const handleExport = async (formato) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/exportar-estabelecimentos?formato=${formato}`, {
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
        a.download = `estabelecimentos_${new Date().toISOString().split('T')[0]}.${formato}`
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
      ativo: { color: 'green', text: 'Ativo', icon: CheckCircle },
      pendente: { color: 'yellow', text: 'Pendente', icon: Clock },
      rejeitado: { color: 'red', text: 'Rejeitado', icon: XCircle },
      suspenso: { color: 'gray', text: 'Suspenso', icon: AlertTriangle }
    }

    const config = statusConfig[status] || { color: 'gray', text: status, icon: Clock }
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

  const getCategoriaIcon = (categoria) => {
    const categorias = {
      'barbearia': '✂️',
      'salon': '💇‍♀️',
      'spa': '🧖‍♀️',
      'estetica': '💄',
      'tatuagem': '🎨',
      'academia': '💪',
      'fisioterapia': '🏥',
      'outros': '🏢'
    }
    return categorias[categoria] || '🏢'
  }

  const columnsEstabelecimentos = [
    { key: 'nome', label: 'Estabelecimento', render: (value, item) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{getCategoriaIcon(item.categoria)}</span>
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
    { key: 'avaliacao', label: 'Avaliação', render: (value) => (
      <div className="flex items-center gap-1">
        <Star className="text-yellow-500" size={16} />
        <span className="font-medium text-gray-900 dark:text-white">
          {value ? value.toFixed(1) : 'N/A'}
        </span>
      </div>
    )},
    { key: 'totalAgendamentos', label: 'Agendamentos', render: (value) => (
      <Badge variant="primary" size="sm">
        {value}
      </Badge>
    )},
    { key: 'status', label: 'Status', render: (value) => getStatusBadge(value) },
    { key: 'criadoEm', label: 'Cadastro', render: (value) => formatDate(value) }
  ]

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total de Estabelecimentos"
          value={stats.totalEstabelecimentos}
          change={stats.crescimentoEstabelecimentos}
          changeType="positive"
          icon={Building2}
          color="purple"
          subtitle={`${stats.estabelecimentosAtivos} ativos`}
        />
        
        <AdminMetricCard
          title="Pendentes de Aprovação"
          value={stats.estabelecimentosPendentes}
          change="0"
          changeType="neutral"
          icon={Clock}
          color="yellow"
          subtitle="Aguardando revisão"
        />
        
        <AdminMetricCard
          title="Receita Total"
          value={`R$ ${stats.receitaTotal.toLocaleString()}`}
          change="15.2"
          changeType="positive"
          icon={DollarSign}
          color="green"
          subtitle="Este mês"
        />
        
        <AdminMetricCard
          title="Avaliação Média"
          value={stats.mediaAvaliacao ? stats.mediaAvaliacao.toFixed(1) : 'N/A'}
          change="0.3"
          changeType="positive"
          icon={Star}
          color="blue"
          subtitle="Satisfação geral"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Crescimento de Estabelecimentos"
          type="line"
          color="purple"
          data={[
            { x: 0, y: 10, label: 'Jan' },
            { x: 1, y: 15, label: 'Fev' },
            { x: 2, y: 22, label: 'Mar' },
            { x: 3, y: 28, label: 'Abr' },
            { x: 4, y: 35, label: 'Mai' },
            { x: 5, y: 42, label: 'Jun' }
          ]}
          trendValue={18.5}
          trendType="positive"
        />
        
        <AdminChart
          title="Distribuição por Categoria"
          type="pie"
          color="blue"
          data={[
            { x: 0, y: 30, label: 'Barbearia' },
            { x: 1, y: 25, label: 'Salão' },
            { x: 2, y: 20, label: 'Spa' },
            { x: 3, y: 15, label: 'Estética' },
            { x: 4, y: 10, label: 'Outros' }
          ]}
        />
      </div>

      {/* Top Estabelecimentos */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Estabelecimentos por Performance
          </h3>
          <div className="space-y-4">
            {estabelecimentos.slice(0, 5).map((estabelecimento, index) => (
              <div key={estabelecimento.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoriaIcon(estabelecimento.categoria)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {estabelecimento.nome}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {estabelecimento.categoria} • {estabelecimento.plano}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {estabelecimento.avaliacao ? estabelecimento.avaliacao.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avaliação</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {estabelecimento.totalAgendamentos}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Agendamentos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 dark:text-white">
                      R$ {estabelecimento.receita || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receita</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {estabelecimentos.map((estabelecimento) => (
        <Card key={estabelecimento.id} className="group hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{getCategoriaIcon(estabelecimento.categoria)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {estabelecimento.nome}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {estabelecimento.categoria}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(estabelecimento.status)}
                {getPlanoBadge(estabelecimento.plano)}
              </div>
            </div>

            {/* Informações */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={16} />
                <span className="text-sm truncate">{estabelecimento.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone size={16} />
                <span className="text-sm">{estabelecimento.telefone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin size={16} />
                <span className="text-sm truncate">{estabelecimento.endereco}</span>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-bold text-gray-900 dark:text-white">
                    {estabelecimento.avaliacao ? estabelecimento.avaliacao.toFixed(1) : 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avaliação</p>
              </div>
              
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white">
                  {estabelecimento.totalAgendamentos}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Agendamentos</p>
              </div>
              
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white">
                  R$ {estabelecimento.receita || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receita</p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalDetalhes({ open: true, estabelecimento })}
                fullWidth
              >
                <Eye size={16} />
                Ver Detalhes
              </Button>
              
              {estabelecimento.status === 'pendente' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleAprovar(estabelecimento.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRejeitar(estabelecimento.id)}
                  >
                    <XCircle size={16} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
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
            onClick={() => setFiltros({ status: '', categoria: '', plano: '', avaliacao: '', dataInicio: '', dataFim: '' })}
          >
            Limpar Filtros
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              <option value="pendente">Pendente</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todas as categorias</option>
              <option value="barbearia">Barbearia</option>
              <option value="salon">Salão</option>
              <option value="spa">Spa</option>
              <option value="estetica">Estética</option>
              <option value="tatuagem">Tatuagem</option>
              <option value="academia">Academia</option>
              <option value="fisioterapia">Fisioterapia</option>
              <option value="outros">Outros</option>
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
              Avaliação Mínima
            </label>
            <select
              value={filtros.avaliacao}
              onChange={(e) => setFiltros({ ...filtros, avaliacao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Qualquer avaliação</option>
              <option value="4">4+ estrelas</option>
              <option value="3">3+ estrelas</option>
              <option value="2">2+ estrelas</option>
              <option value="1">1+ estrelas</option>
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

      {/* Modal de Confirmação */}
      <Modal
        isOpen={modalDelete.open}
        onClose={() => setModalDelete({ open: false, id: '', nome: '' })}
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
              onClick={() => setModalDelete({ open: false, id: '', nome: '' })}
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

      {/* Modal de Detalhes */}
      <Modal
        isOpen={modalDetalhes.open}
        onClose={() => setModalDetalhes({ open: false, estabelecimento: null })}
        title="Detalhes do Estabelecimento"
        maxWidth="4xl"
      >
        {modalDetalhes.estabelecimento && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Informações Básicas</h4>
                <div className="space-y-2">
                  <p><strong>Nome:</strong> {modalDetalhes.estabelecimento.nome}</p>
                  <p><strong>Email:</strong> {modalDetalhes.estabelecimento.email}</p>
                  <p><strong>Telefone:</strong> {modalDetalhes.estabelecimento.telefone}</p>
                  <p><strong>Endereço:</strong> {modalDetalhes.estabelecimento.endereco}</p>
                  <p><strong>Categoria:</strong> {modalDetalhes.estabelecimento.categoria}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Métricas</h4>
                <div className="space-y-2">
                  <p><strong>Avaliação:</strong> {modalDetalhes.estabelecimento.avaliacao ? modalDetalhes.estabelecimento.avaliacao.toFixed(1) : 'N/A'}</p>
                  <p><strong>Agendamentos:</strong> {modalDetalhes.estabelecimento.totalAgendamentos}</p>
                  <p><strong>Receita:</strong> R$ {modalDetalhes.estabelecimento.receita || 0}</p>
                  <p><strong>Status:</strong> {getStatusBadge(modalDetalhes.estabelecimento.status)}</p>
                  <p><strong>Plano:</strong> {getPlanoBadge(modalDetalhes.estabelecimento.plano)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div className="space-y-6">
        {/* Header Ultra Profissional */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Gerenciar Estabelecimentos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Controle total de estabelecimentos e aprovações
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
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'cards' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <PieChart size={16} />
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
        ) : viewMode === 'cards' ? (
          renderCards()
        ) : (
          <AdminTable
            title="Estabelecimentos Cadastrados"
            data={estabelecimentos}
            columns={columnsEstabelecimentos}
            searchable={false}
            filterable={false}
            actions={true}
            pagination={true}
            pageSize={pagination.limit}
            onEdit={(item) => console.log('Editar:', item)}
            onDelete={(item) => setModalDelete({
              open: true,
              id: item.id,
              nome: item.nome
            })}
            onView={(item) => setModalDetalhes({ open: true, estabelecimento: item })}
            onExport={() => handleExport('csv')}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default GerenciarEstabelecimentos
