import { useState, useEffect } from 'react'
import { 
  FileText, 
  Filter, 
  Trash2, 
  Eye, 
  Search,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Activity,
  Database,
  Server,
  Globe,
  Lock,
  Unlock,
  Edit,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  Star,
  Crown,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Award,
  Globe2,
  Wifi,
  Cpu,
  HardDrive,
  Save,
  Share2,
  Printer,
  Send,
  ExternalLink,
  Copy,
  Archive,
  ArchiveRestore
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

const LogsAuditoria = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [filtros, setFiltros] = useState({ 
    acao: '', 
    entidade: '', 
    admin: '',
    dataInicio: '',
    dataFim: '',
    ipAddress: '',
    status: ''
  })
  const [modalDetalhes, setModalDetalhes] = useState({ open: false, log: null })
  const [pagination, setPagination] = useState({ page: 1, limit: 50 })
  const [stats, setStats] = useState({
    totalLogs: 0,
    logsHoje: 0,
    logsSemana: 0,
    acoesMaisComuns: [],
    adminsAtivos: 0,
    entidadesMaisAfetadas: [],
    logsPorHora: [],
    taxaErro: 0
  })
  const [viewMode, setViewMode] = useState('table') // table, analytics, timeline
  const [selectedLogs, setSelectedLogs] = useState([])
  const [exportFormat, setExportFormat] = useState('csv')

  useEffect(() => {
    carregarLogs()
    carregarEstatisticas()
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

  const carregarEstatisticas = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://jfagende-production.up.railway.app/api/admin/estatisticas-logs', {
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

  const handleExport = async (formato) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/exportar-logs?formato=${formato}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filtros,
          selectedLogs: selectedLogs.length > 0 ? selectedLogs : logs.map(log => log.id)
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `logs_auditoria_${new Date().toISOString().split('T')[0]}.${formato}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setToast({ type: 'success', message: 'Logs exportados com sucesso' })
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      setToast({ type: 'error', message: 'Erro ao exportar logs' })
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

  const getAcaoIcon = (acao) => {
    const acoes = {
      'CREATE': { icon: Plus, color: 'green' },
      'UPDATE': { icon: Edit, color: 'blue' },
      'DELETE': { icon: Trash2, color: 'red' },
      'LOGIN': { icon: LogIn, color: 'purple' },
      'LOGOUT': { icon: LogOut, color: 'gray' },
      'CHANGE_PASSWORD': { icon: Lock, color: 'yellow' },
      'APPROVE': { icon: CheckCircle, color: 'green' },
      'REJECT': { icon: XCircle, color: 'red' },
      'EXPORT': { icon: Download, color: 'blue' },
      'IMPORT': { icon: Upload, color: 'blue' },
      'BACKUP': { icon: Database, color: 'purple' },
      'RESTORE': { icon: ArchiveRestore, color: 'purple' }
    }

    const config = acoes[acao] || { icon: Activity, color: 'gray' }
    const Icon = config.icon
    
    return (
      <div className={`p-2 rounded-lg bg-${config.color}-100 dark:bg-${config.color}-900/20`}>
        <Icon size={16} className={`text-${config.color}-600 dark:text-${config.color}-400`} />
      </div>
    )
  }

  const getAcaoColor = (acao) => {
    if (acao.includes('CREATE')) return 'success'
    if (acao.includes('DELETE')) return 'danger'
    if (acao.includes('UPDATE') || acao.includes('CHANGE')) return 'warning'
    if (acao === 'LOGIN') return 'primary'
    if (acao === 'LOGOUT') return 'default'
    return 'info'
  }

  const getEntidadeIcon = (entidade) => {
    const entidades = {
      'Usuario': User,
      'Estabelecimento': Building2,
      'Agendamento': Calendar,
      'Plano': Crown,
      'Pagamento': DollarSign,
      'Sistema': Server,
      'Admin': Shield,
      'Log': FileText
    }

    const Icon = entidades[entidade] || Activity
    return <Icon size={16} className="text-gray-500" />
  }

  const acoes = [...new Set(logs.map(log => log.acao))]
  const entidades = [...new Set(logs.map(log => log.entidade))]
  const admins = [...new Set(logs.map(log => log.admin?.nome))]

  const columnsLogs = [
    { key: 'criadoEm', label: 'Data/Hora', render: (value) => (
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      </div>
    )},
    { key: 'acao', label: 'Ação', render: (value) => (
      <div className="flex items-center gap-2">
        {getAcaoIcon(value)}
        <Badge variant={getAcaoColor(value)} size="sm">
          {value}
        </Badge>
      </div>
    )},
    { key: 'entidade', label: 'Entidade', render: (value) => (
      <div className="flex items-center gap-2">
        {getEntidadeIcon(value)}
        <span className="font-medium text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
    )},
    { key: 'admin', label: 'Admin', render: (value) => (
      <div className="flex items-center gap-2">
        <User size={16} className="text-gray-400" />
        <span className="text-gray-600 dark:text-gray-400">
          {value?.nome || 'Sistema'}
        </span>
      </div>
    )},
    { key: 'ipAddress', label: 'IP Address', render: (value) => (
      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
        {value || 'N/A'}
      </code>
    )},
    { key: 'status', label: 'Status', render: (value) => (
      <Badge 
        className={value === 'success' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'}
        size="sm"
      >
        {value || 'success'}
      </Badge>
    )}
  ]

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total de Logs"
          value={stats.totalLogs}
          change="0"
          changeType="neutral"
          icon={FileText}
          color="blue"
          subtitle={`${stats.logsHoje} hoje`}
        />
        
        <AdminMetricCard
          title="Logs Hoje"
          value={stats.logsHoje}
          change="12.5"
          changeType="positive"
          icon={Clock}
          color="green"
          subtitle="Últimas 24h"
        />
        
        <AdminMetricCard
          title="Admins Ativos"
          value={stats.adminsAtivos}
          change="0"
          changeType="neutral"
          icon={Shield}
          color="purple"
          subtitle="Esta semana"
        />
        
        <AdminMetricCard
          title="Taxa de Erro"
          value={`${stats.taxaErro}%`}
          change="-2.1"
          changeType="negative"
          icon={AlertTriangle}
          color="red"
          subtitle="Últimos 7 dias"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Logs por Hora"
          type="line"
          color="blue"
          data={stats.logsPorHora.map((item, index) => ({
            x: index,
            y: item.quantidade,
            label: item.hora
          }))}
          trendValue={8.5}
          trendType="positive"
        />
        
        <AdminChart
          title="Ações Mais Comuns"
          type="pie"
          color="purple"
          data={stats.acoesMaisComuns.map((item, index) => ({
            x: index,
            y: item.quantidade,
            label: item.acao
          }))}
        />
      </div>

      {/* Top Entidades Afetadas */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Entidades Mais Afetadas
          </h3>
          <div className="space-y-4">
            {stats.entidadesMaisAfetadas.map((entidade, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getEntidadeIcon(entidade.nome)}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {entidade.nome}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {entidade.acoes} ações realizadas
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {entidade.quantidade}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    logs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )

  const renderTimeline = () => (
    <div className="space-y-6">
      {logs.map((log, index) => (
        <Card key={log.id} className="group hover:shadow-lg transition-all duration-200">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getAcaoIcon(log.acao)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getAcaoColor(log.acao)} size="sm">
                    {log.acao}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(log.criadoEm)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Entidade:</strong> {log.entidade}
                    {log.entidadeId && (
                      <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        ID: {log.entidadeId}
                      </span>
                    )}
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Admin:</strong> {log.admin?.nome || 'Sistema'}
                    {log.ipAddress && (
                      <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        IP: {log.ipAddress}
                      </span>
                    )}
                  </p>
                  
                  {log.detalhes && (
                    <div className="mt-2">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          Ver detalhes
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                          {JSON.stringify(JSON.parse(log.detalhes), null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalDetalhes({ open: true, log })}
                >
                  <Eye size={16} />
                </Button>
              </div>
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={carregarLogs}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </Button>
            <Button
              variant="outline"
              onClick={() => setFiltros({ acao: '', entidade: '', admin: '', dataInicio: '', dataFim: '', ipAddress: '', status: '' })}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ação
            </label>
            <select
              value={filtros.acao}
              onChange={(e) => setFiltros({ ...filtros, acao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todas as ações</option>
              {acoes.map((acao) => (
                <option key={acao} value={acao}>{acao}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Entidade
            </label>
            <select
              value={filtros.entidade}
              onChange={(e) => setFiltros({ ...filtros, entidade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todas as entidades</option>
              {entidades.map((entidade) => (
                <option key={entidade} value={entidade}>{entidade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin
            </label>
            <select
              value={filtros.admin}
              onChange={(e) => setFiltros({ ...filtros, admin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os admins</option>
              {admins.map((admin) => (
                <option key={admin} value={admin}>{admin}</option>
              ))}
            </select>
          </div>

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
              <option value="success">Sucesso</option>
              <option value="error">Erro</option>
              <option value="warning">Aviso</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              IP Address
            </label>
            <input
              type="text"
              value={filtros.ipAddress}
              onChange={(e) => setFiltros({ ...filtros, ipAddress: e.target.value })}
              placeholder="192.168.1.1"
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

      {/* Modal de Detalhes */}
      <Modal
        isOpen={modalDetalhes.open}
        onClose={() => setModalDetalhes({ open: false, log: null })}
        title="Detalhes do Log"
        maxWidth="4xl"
      >
        {modalDetalhes.log && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Informações Básicas</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ação:</p>
                    <div className="flex items-center gap-2">
                      {getAcaoIcon(modalDetalhes.log.acao)}
                      <Badge variant={getAcaoColor(modalDetalhes.log.acao)}>
                        {modalDetalhes.log.acao}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entidade:</p>
                    <div className="flex items-center gap-2">
                      {getEntidadeIcon(modalDetalhes.log.entidade)}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {modalDetalhes.log.entidade}
                      </span>
                    </div>
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
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {modalDetalhes.log.admin?.nome || 'Sistema'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data/Hora:</p>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(modalDetalhes.log.criadoEm)}
                      </span>
                    </div>
                  </div>

                  {modalDetalhes.log.ipAddress && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IP Address:</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {modalDetalhes.log.ipAddress}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Detalhes Técnicos</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status:</p>
                    <Badge 
                      className={modalDetalhes.log.status === 'success' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'}
                    >
                      {modalDetalhes.log.status || 'success'}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User Agent:</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block break-all">
                      {modalDetalhes.log.userAgent || 'N/A'}
                    </code>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Referer:</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block break-all">
                      {modalDetalhes.log.referer || 'N/A'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {modalDetalhes.log.detalhes && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Dados da Ação</h4>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(modalDetalhes.log.detalhes), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      <div className="space-y-6">
        {/* Header Ultra Profissional */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-2">
                Logs de Auditoria
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Histórico completo de todas as ações administrativas
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Sistema Monitorado
                </span>
              </div>
              
              <Button
                onClick={carregarLogs}
                variant="outline"
                size="sm"
                className="hover:bg-gray-50 dark:hover:bg-gray-900/20"
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
            <div className="flex items-center justify-between">
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
                  <PieChart size={16} />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'timeline' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Activity size={16} />
                </button>
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
                <Button
                  variant="danger"
                  onClick={handleLimparLogs}
                  size="sm"
                >
                  <Trash2 size={16} />
                  Limpar Logs
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Filtros */}
        {renderFiltros()}

        {/* Conteúdo Principal */}
        {viewMode === 'analytics' ? (
          renderAnalytics()
        ) : viewMode === 'timeline' ? (
          renderTimeline()
        ) : (
          <AdminTable
            title="Logs de Auditoria"
            data={logs}
            columns={columnsLogs}
            searchable={false}
            filterable={false}
            actions={true}
            pagination={true}
            pageSize={pagination.limit}
            onEdit={(item) => console.log('Editar:', item)}
            onDelete={(item) => console.log('Deletar:', item)}
            onView={(item) => setModalDetalhes({ open: true, log: item })}
            onExport={() => handleExport('csv')}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default LogsAuditoria