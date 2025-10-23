import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Shield, 
  Settings, 
  BarChart3, 
  PieChart, 
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Plus,
  MoreVertical,
  RefreshCw,
  Bell,
  Mail,
  Phone,
  MapPin,
  Globe,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Badge from '../components/Badge'
import AnimatedNumber from '../components/AnimatedNumber'

const DashboardAdmin = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEstabelecimentos: 0,
    totalAgendamentos: 0,
    receitaTotal: 0,
    crescimentoUsuarios: 0,
    crescimentoEstabelecimentos: 0,
    crescimentoAgendamentos: 0,
    crescimentoReceita: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    memoryUsage: '68%',
    cpuUsage: '45%'
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStats({
        totalUsers: 1247,
        totalEstabelecimentos: 89,
        totalAgendamentos: 3456,
        receitaTotal: 45678.90,
        crescimentoUsuarios: 12.5,
        crescimentoEstabelecimentos: 8.3,
        crescimentoAgendamentos: 23.7,
        crescimentoReceita: 18.2
      })

      setRecentActivity([
        { id: 1, type: 'user', action: 'Novo usuário cadastrado', user: 'João Silva', time: '2 min atrás', status: 'success' },
        { id: 2, type: 'estabelecimento', action: 'Estabelecimento aprovado', user: 'Salão da Maria', time: '5 min atrás', status: 'success' },
        { id: 3, type: 'agendamento', action: 'Agendamento cancelado', user: 'Cliente Anônimo', time: '8 min atrás', status: 'warning' },
        { id: 4, type: 'payment', action: 'Pagamento processado', user: 'R$ 150,00', time: '12 min atrás', status: 'success' },
        { id: 5, type: 'system', action: 'Backup realizado', user: 'Sistema', time: '1 hora atrás', status: 'info' }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados do painel' })
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users size={16} className="text-blue-500" />
      case 'estabelecimento': return <Building2 size={16} className="text-green-500" />
      case 'agendamento': return <Calendar size={16} className="text-purple-500" />
      case 'payment': return <DollarSign size={16} className="text-yellow-500" />
      case 'system': return <Server size={16} className="text-gray-500" />
      default: return <Activity size={16} className="text-gray-500" />
    }
  }

  const getActivityStatus = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'error': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'info': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Carregando Painel Admin...</h2>
          <p className="text-gray-500 dark:text-gray-400">Preparando dados e métricas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
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

      {/* Header Ultra Profissional */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Controle total da plataforma JFAgende
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={carregarDados}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RefreshCw size={16} />
                Atualizar
              </Button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Sistema Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Usuários */}
          <Card className="group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-semibold">+{stats.crescimentoUsuarios}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total de Usuários
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={stats.totalUsers} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{Math.floor(stats.totalUsers * stats.crescimentoUsuarios / 100)} este mês
                </p>
              </div>
            </div>
          </Card>

          {/* Total de Estabelecimentos */}
          <Card className="group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-semibold">+{stats.crescimentoEstabelecimentos}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Estabelecimentos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={stats.totalEstabelecimentos} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{Math.floor(stats.totalEstabelecimentos * stats.crescimentoEstabelecimentos / 100)} este mês
                </p>
              </div>
            </div>
          </Card>

          {/* Total de Agendamentos */}
          <Card className="group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-semibold">+{stats.crescimentoAgendamentos}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Agendamentos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={stats.totalAgendamentos} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{Math.floor(stats.totalAgendamentos * stats.crescimentoAgendamentos / 100)} este mês
                </p>
              </div>
            </div>
          </Card>

          {/* Receita Total */}
          <Card className="group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-semibold">+{stats.crescimentoReceita}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Receita Total
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ <AnimatedNumber value={stats.receitaTotal} decimalPlaces={2} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +R$ {Math.floor(stats.receitaTotal * stats.crescimentoReceita / 100).toLocaleString()} este mês
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Atividade Recente */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Atividade Recente
                  </h3>
                  <Button variant="ghost" size="sm">
                    Ver Todas
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                      <Badge 
                        className={getActivityStatus(activity.status)}
                        size="sm"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Status do Sistema */}
          <div>
            <Card className="h-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Status do Sistema
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Uptime */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Uptime</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Disponibilidade</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {systemHealth.uptime}
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Response Time</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tempo de resposta</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {systemHealth.responseTime}
                    </p>
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <HardDrive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Memória</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Uso atual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {systemHealth.memoryUsage}
                    </p>
                  </div>
                </div>

                {/* CPU Usage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">CPU</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Processamento</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {systemHealth.cpuUsage}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ações Rápidas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate('/admin/clientes')}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Gerenciar Usuários</span>
              </Button>
              
              <Button
                onClick={() => navigate('/admin/estabelecimentos')}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Building2 className="w-6 h-6" />
                <span className="text-sm font-medium">Estabelecimentos</span>
              </Button>
              
              <Button
                onClick={() => navigate('/admin/planos')}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <DollarSign className="w-6 h-6" />
                <span className="text-sm font-medium">Planos</span>
              </Button>
              
              <Button
                onClick={() => navigate('/admin/relatorios')}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm font-medium">Relatórios</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardAdmin