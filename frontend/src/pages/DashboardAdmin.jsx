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
  Zap,
  Megaphone,
  Code,
  FileText,
  Headphones,
  HelpCircle,
  BookOpen
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
      
      // Buscar dados reais da API
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://jfagende-production.up.railway.app/api/admin/estatisticas-gerais', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const dadosReais = await response.json()
      console.log('📊 Dados reais recebidos:', dadosReais)
      
      setStats({
        totalUsers: dadosReais.totalUsuarios || 0,
        totalEstabelecimentos: dadosReais.totalEstabelecimentos || 0,
        totalAgendamentos: dadosReais.totalAgendamentos || 0,
        receitaTotal: dadosReais.receitaTotal || 0,
        crescimentoUsuarios: dadosReais.crescimentoUsuarios || 0,
        crescimentoEstabelecimentos: dadosReais.crescimentoEstabelecimentos || 0,
        crescimentoAgendamentos: dadosReais.crescimentoAgendamentos || 0,
        crescimentoReceita: dadosReais.crescimentoReceita || 0
      })

      // Buscar atividade recente
      const activityResponse = await fetch('https://jfagende-production.up.railway.app/api/admin/atividade-recente', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.atividades || [])
      } else {
        // Fallback para dados simulados
        setRecentActivity([
          {
            id: 1,
            type: 'user_registration',
            message: 'Novo usuário registrado: João Silva',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            icon: Users,
            color: 'green'
          },
          {
            id: 2,
            type: 'establishment_created',
            message: 'Novo estabelecimento: Salão Beleza & Cia',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            icon: Building2,
            color: 'blue'
          },
          {
            id: 3,
            type: 'appointment_created',
            message: 'Novo agendamento criado',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
            icon: Calendar,
            color: 'purple'
          }
        ])
      }

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error)
      
      // Fallback para dados simulados em caso de erro
      setStats({
        totalUsers: 1250,
        totalEstabelecimentos: 89,
        totalAgendamentos: 4560,
        receitaTotal: 125680.50,
        crescimentoUsuarios: 12.5,
        crescimentoEstabelecimentos: 8.3,
        crescimentoAgendamentos: 15.7,
        crescimentoReceita: 22.1
      })
      
      setRecentActivity([
        {
          id: 1,
          type: 'user_registration',
          message: 'Novo usuário registrado: João Silva',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          icon: Users,
          color: 'green'
        },
        {
          id: 2,
          type: 'establishment_created',
          message: 'Novo estabelecimento: Salão Beleza & Cia',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          icon: Building2,
          color: 'blue'
        },
        {
          id: 3,
          type: 'appointment_created',
          message: 'Novo agendamento criado',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          icon: Calendar,
          color: 'purple'
        }
      ])
      
      setToast({ type: 'error', message: 'Erro ao carregar dados do painel' })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getHealthBgColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 dark:bg-green-900/20'
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20'
      case 'critical': return 'bg-red-100 dark:bg-red-900/20'
      default: return 'bg-gray-100 dark:bg-gray-900/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Premium */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Bem-vindo, {user?.nome || 'Administrador'} • {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={carregarDados}
                variant="outline"
                size="sm"
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80"
              >
                <RefreshCw size={16} />
                Atualizar
              </Button>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Sistema Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Usuários</p>
                <p className="text-3xl font-bold mt-2">
                  <AnimatedNumber value={stats.totalUsers} />
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium ml-1">
                    +{stats.crescimentoUsuarios}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Estabelecimentos</p>
                <p className="text-3xl font-bold mt-2">
                  <AnimatedNumber value={stats.totalEstabelecimentos} />
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium ml-1">
                    +{stats.crescimentoEstabelecimentos}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Agendamentos</p>
                <p className="text-3xl font-bold mt-2">
                  <AnimatedNumber value={stats.totalAgendamentos} />
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium ml-1">
                    +{stats.crescimentoAgendamentos}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Receita Total</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(stats.receitaTotal)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium ml-1">
                    +{stats.crescimentoReceita}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </Card>
        </div>

        {/* Status do Sistema */}
        <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Status do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-lg font-bold text-green-600 capitalize">{systemHealth.status}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
              <p className="text-lg font-bold text-blue-600">{systemHealth.uptime}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tempo de Resposta</p>
              <p className="text-lg font-bold text-purple-600">{systemHealth.responseTime}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Server className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU</p>
              <p className="text-lg font-bold text-orange-600">{systemHealth.cpuUsage}</p>
            </div>
          </div>
        </Card>

        {/* Funcionalidades do Painel */}
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Settings className="w-7 h-7 text-blue-600" />
            Funcionalidades Administrativas
          </h3>
          
          {/* Primeira linha de funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Button
              onClick={() => navigate('/admin/analytics')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="w-8 h-8" />
              <span className="text-sm font-semibold">Analytics</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/notificacoes')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
            >
              <Bell className="w-8 h-8" />
              <span className="text-sm font-semibold">Notificações</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/monitoramento')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
            >
              <Server className="w-8 h-8" />
              <span className="text-sm font-semibold">Monitoramento</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/logs')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl"
            >
              <Database className="w-8 h-8" />
              <span className="text-sm font-semibold">Logs</span>
            </Button>
          </div>

          {/* Segunda linha de funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Button
              onClick={() => navigate('/admin/backup')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            >
              <HardDrive className="w-8 h-8" />
              <span className="text-sm font-semibold">Backup</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/seguranca')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
            >
              <Shield className="w-8 h-8" />
              <span className="text-sm font-semibold">Segurança</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/financeiro')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
            >
              <DollarSign className="w-8 h-8" />
              <span className="text-sm font-semibold">Financeiro</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/marketing')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
            >
              <Megaphone className="w-8 h-8" />
              <span className="text-sm font-semibold">Marketing</span>
            </Button>
          </div>

          {/* Terceira linha de funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button
              onClick={() => navigate('/admin/api')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
            >
              <Code className="w-8 h-8" />
              <span className="text-sm font-semibold">API</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/conteudo')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
            >
              <FileText className="w-8 h-8" />
              <span className="text-sm font-semibold">Conteúdo</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin/suporte')}
              className="h-24 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
            >
              <Headphones className="w-8 h-8" />
              <span className="text-sm font-semibold">Suporte</span>
            </Button>
            
            <div className="h-24 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
              <div className="text-center">
                <Plus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Em breve...
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Atividade Recente */}
        <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {recentActivity.map(activity => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className={`p-3 rounded-xl bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                    <Icon className={`w-5 h-5 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(activity.timestamp)}</p>
                  </div>
                  <Badge color={activity.color} size="sm">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

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
    </div>
  )
}

export default DashboardAdmin