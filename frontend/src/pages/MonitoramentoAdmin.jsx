import { useState, useEffect } from 'react'
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  RefreshCw, 
  Settings, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  Play, 
  Pause, 
  Stop, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Copy, 
  ExternalLink, 
  Lock, 
  Unlock, 
  Shield, 
  Bell, 
  Mail, 
  Phone, 
  MessageCircle, 
  Camera, 
  Image as ImageIcon, 
  File, 
  FileText, 
  Link, 
  Hash, 
  AtSign, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Bookmark, 
  Tag, 
  Hash as HashIcon, 
  AtSign as AtSignIcon, 
  Plus as PlusIcon, 
  Minus as MinusIcon, 
  Equal, 
  Divide, 
  Multiply, 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  Octagon, 
  Diamond, 
  Heart as HeartIcon, 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Angry, 
  Surprised, 
  Confused, 
  Wink, 
  Kiss, 
  Tongue, 
  ThumbsDown as ThumbsDownIcon, 
  Hand, 
  Clap, 
  Wave, 
  Point, 
  Peace, 
  Victory, 
  Ok, 
  No, 
  Yes, 
  Maybe, 
  Question, 
  Exclamation, 
  Asterisk, 
  Ampersand, 
  DollarSign, 
  Euro, 
  Pound, 
  Yen, 
  Rupee, 
  Won, 
  Peso, 
  Franc, 
  Lira, 
  Ruble, 
  Shekel, 
  Baht, 
  Real, 
  Rand, 
  Krona, 
  Krone, 
  Guilder, 
  Escudo, 
  Dinar, 
  Dirham, 
  Rial, 
  Taka, 
  Tugrik, 
  Kip, 
  Riel, 
  Dong, 
  Peso as PesoIcon, 
  Colon, 
  Cordoba, 
  Quetzal, 
  Lempira, 
  Balboa, 
  Guarani, 
  Boliviano, 
  Sucre, 
  Sol, 
  Inti, 
  Cruzeiro, 
  Cruzado, 
  Real as RealIcon, 
  MilReis, 
  Conto, 
  Escudo as EscudoIcon, 
  Pataca, 
  Macanese, 
  HongKong, 
  Taiwan, 
  Singapore, 
  Malaysia, 
  Indonesia, 
  Philippines, 
  Thailand, 
  Vietnam, 
  Cambodia, 
  Laos, 
  Myanmar, 
  Bangladesh, 
  SriLanka, 
  Nepal, 
  Bhutan, 
  Maldives, 
  Pakistan, 
  Afghanistan, 
  Iran, 
  Iraq, 
  Syria, 
  Lebanon, 
  Jordan, 
  Israel, 
  Palestine, 
  SaudiArabia, 
  Kuwait, 
  Bahrain, 
  Qatar, 
  UAE, 
  Oman, 
  Yemen, 
  Turkey, 
  Cyprus, 
  Greece, 
  Bulgaria, 
  Romania, 
  Moldova, 
  Ukraine, 
  Belarus, 
  Lithuania, 
  Latvia, 
  Estonia, 
  Finland, 
  Sweden, 
  Norway, 
  Denmark, 
  Iceland, 
  Ireland, 
  UK, 
  France, 
  Spain, 
  Portugal, 
  Italy, 
  Switzerland, 
  Austria, 
  Germany, 
  Netherlands, 
  Belgium, 
  Luxembourg, 
  Poland, 
  Czech, 
  Slovakia, 
  Hungary, 
  Slovenia, 
  Croatia, 
  Bosnia, 
  Serbia, 
  Montenegro, 
  Macedonia, 
  Albania, 
  Kosovo, 
  Malta, 
  Monaco, 
  SanMarino, 
  Vatican, 
  Andorra, 
  Liechtenstein, 
  Russia, 
  Kazakhstan, 
  Uzbekistan, 
  Turkmenistan, 
  Tajikistan, 
  Kyrgyzstan, 
  Mongolia, 
  China, 
  Japan, 
  Korea, 
  NorthKorea, 
  India, 
  Brazil, 
  Argentina, 
  Chile, 
  Peru, 
  Colombia, 
  Venezuela, 
  Ecuador, 
  Bolivia, 
  Paraguay, 
  Uruguay, 
  Guyana, 
  Suriname, 
  FrenchGuiana, 
  Canada, 
  USA, 
  Mexico, 
  Guatemala, 
  Belize, 
  ElSalvador, 
  Honduras, 
  Nicaragua, 
  CostaRica, 
  Panama, 
  Cuba, 
  Jamaica, 
  Haiti, 
  DominicanRepublic, 
  PuertoRico, 
  Trinidad, 
  Barbados, 
  SaintLucia, 
  SaintVincent, 
  Grenada, 
  Dominica, 
  Antigua, 
  SaintKitts, 
  Nevis, 
  Montserrat, 
  Anguilla, 
  BritishVirginIslands, 
  USVirginIslands, 
  Turks, 
  Caicos, 
  Bahamas, 
  Bermuda, 
  Greenland, 
  SaintPierre, 
  Miquelon, 
  Australia, 
  NewZealand, 
  Papua, 
  NewGuinea, 
  Fiji, 
  Samoa, 
  Tonga, 
  Vanuatu, 
  Solomon, 
  Islands, 
  Kiribati, 
  Tuvalu, 
  Nauru, 
  Palau, 
  Marshall, 
  Micronesia, 
  Cook, 
  Niue, 
  Tokelau, 
  Pitcairn, 
  Norfolk, 
  Christmas, 
  Cocos, 
  Heard, 
  McDonald, 
  Bouvet, 
  SouthGeorgia, 
  SouthSandwich, 
  FrenchSouthern, 
  Antarctic, 
  BritishAntarctic, 
  AustralianAntarctic, 
  NorwegianAntarctic, 
  ChileanAntarctic, 
  ArgentineAntarctic, 
  SouthAfricanAntarctic, 
  IndianAntarctic, 
  JapaneseAntarctic, 
  GermanAntarctic, 
  ItalianAntarctic, 
  PolishAntarctic, 
  BrazilianAntarctic, 
  UruguayanAntarctic, 
  PeruvianAntarctic, 
  EcuadorianAntarctic, 
  ColombianAntarctic, 
  VenezuelanAntarctic, 
  BolivianAntarctic, 
  ParaguayanAntarctic, 
  ChileanAntarctic as ChileanAntarcticIcon, 
  ArgentineAntarctic as ArgentineAntarcticIcon, 
  SouthAfricanAntarctic as SouthAfricanAntarcticIcon, 
  IndianAntarctic as IndianAntarcticIcon, 
  JapaneseAntarctic as JapaneseAntarcticIcon, 
  GermanAntarctic as GermanAntarcticIcon, 
  ItalianAntarctic as ItalianAntarcticIcon, 
  PolishAntarctic as PolishAntarcticIcon, 
  BrazilianAntarctic as BrazilianAntarcticIcon, 
  UruguayanAntarctic as UruguayanAntarcticIcon, 
  PeruvianAntarctic as PeruvianAntarcticIcon, 
  EcuadorianAntarctic as EcuadorianAntarcticIcon, 
  ColombianAntarctic as ColombianAntarcticIcon, 
  VenezuelanAntarctic as VenezuelanAntarcticIcon, 
  BolivianAntarctic as BolivianAntarcticIcon, 
  ParaguayanAntarctic as ParaguayanAntarcticIcon
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import AdminMetricCard from '../components/AdminMetricCard'
import AdminChart from '../components/AdminChart'
import Badge from '../components/Badge'

const MonitoramentoAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const [viewMode, setViewMode] = useState('overview') // overview, detailed, alerts

  const [systemMetrics, setSystemMetrics] = useState({
    server: {
      status: 'online',
      uptime: '99.9%',
      responseTime: 120,
      cpuUsage: 45,
      memoryUsage: 68,
      diskUsage: 32,
      networkLatency: 15
    },
    database: {
      status: 'online',
      connections: 45,
      queryTime: 85,
      cacheHitRate: 92,
      size: '2.4GB',
      lastBackup: '2 hours ago'
    },
    application: {
      status: 'online',
      activeUsers: 156,
      requestsPerMinute: 234,
      errorRate: 0.2,
      responseTime: 180,
      throughput: 1.2
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'High CPU Usage',
        message: 'CPU usage is above 80% for the last 5 minutes',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'active',
        severity: 'medium'
      },
      {
        id: 2,
        type: 'error',
        title: 'Database Connection Pool Exhausted',
        message: 'Database connection pool is at 95% capacity',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'resolved',
        severity: 'high'
      },
      {
        id: 3,
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for tonight at 2 AM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'scheduled',
        severity: 'low'
      }
    ],
    performance: {
      cpuHistory: [
        { time: '00:00', value: 35 },
        { time: '00:15', value: 42 },
        { time: '00:30', value: 38 },
        { time: '00:45', value: 45 },
        { time: '01:00', value: 52 },
        { time: '01:15', value: 48 },
        { time: '01:30', value: 41 },
        { time: '01:45', value: 39 },
        { time: '02:00', value: 44 }
      ],
      memoryHistory: [
        { time: '00:00', value: 60 },
        { time: '00:15', value: 62 },
        { time: '00:30', value: 65 },
        { time: '00:45', value: 68 },
        { time: '01:00', value: 70 },
        { time: '01:15', value: 72 },
        { time: '01:30', value: 69 },
        { time: '01:45', value: 66 },
        { time: '02:00', value: 68 }
      ],
      responseTimeHistory: [
        { time: '00:00', value: 120 },
        { time: '00:15', value: 135 },
        { time: '00:30', value: 142 },
        { time: '00:45', value: 138 },
        { time: '01:00', value: 155 },
        { time: '01:15', value: 148 },
        { time: '01:30', value: 132 },
        { time: '01:45', value: 125 },
        { time: '02:00', value: 130 }
      ]
    }
  })

  const timeRanges = [
    { value: '15m', label: 'Últimos 15 min' },
    { value: '1h', label: 'Última hora' },
    { value: '6h', label: 'Últimas 6 horas' },
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' }
  ]

  const viewModes = [
    { value: 'overview', label: 'Visão Geral', icon: Activity },
    { value: 'detailed', label: 'Detalhado', icon: Server },
    { value: 'alerts', label: 'Alertas', icon: AlertTriangle }
  ]

  useEffect(() => {
    carregarMetricas()
  }, [selectedTimeRange])

  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        carregarMetricas()
      }, refreshInterval * 1000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const carregarMetricas = async () => {
    setLoading(true)
    try {
      // Simular dados de monitoramento (em produção, buscar da API)
      const dadosSimulados = {
        server: {
          status: Math.random() > 0.1 ? 'online' : 'offline',
          uptime: '99.9%',
          responseTime: Math.floor(Math.random() * 200) + 50,
          cpuUsage: Math.floor(Math.random() * 100),
          memoryUsage: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
          networkLatency: Math.floor(Math.random() * 50) + 10
        },
        database: {
          status: Math.random() > 0.05 ? 'online' : 'offline',
          connections: Math.floor(Math.random() * 100) + 20,
          queryTime: Math.floor(Math.random() * 200) + 50,
          cacheHitRate: Math.floor(Math.random() * 20) + 80,
          size: '2.4GB',
          lastBackup: '2 hours ago'
        },
        application: {
          status: Math.random() > 0.02 ? 'online' : 'offline',
          activeUsers: Math.floor(Math.random() * 200) + 100,
          requestsPerMinute: Math.floor(Math.random() * 500) + 100,
          errorRate: Math.random() * 2,
          responseTime: Math.floor(Math.random() * 300) + 100,
          throughput: Math.random() * 2 + 0.5
        }
      }

      setSystemMetrics(prev => ({
        ...prev,
        ...dadosSimulados
      }))
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
      setToast({ type: 'error', message: 'Erro ao carregar métricas do sistema' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'green'
      case 'offline': return 'red'
      case 'warning': return 'yellow'
      case 'maintenance': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return CheckCircle
      case 'offline': return XCircle
      case 'warning': return AlertTriangle
      case 'maintenance': return Clock
      default: return Activity
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'gray'
      case 'medium': return 'yellow'
      case 'high': return 'orange'
      case 'critical': return 'red'
      default: return 'gray'
    }
  }

  const formatUptime = (uptime) => {
    return uptime
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-${getStatusColor(systemMetrics.server.status)}-100 dark:bg-${getStatusColor(systemMetrics.server.status)}-900/20`}>
              <Server className={`text-${getStatusColor(systemMetrics.server.status)}-600 dark:text-${getStatusColor(systemMetrics.server.status)}-400`} size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Servidor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className={`font-medium text-${getStatusColor(systemMetrics.server.status)}-600`}>
                  {systemMetrics.server.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="font-medium">{systemMetrics.server.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tempo de Resposta</span>
              <span className="font-medium">{systemMetrics.server.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Latência</span>
              <span className="font-medium">{systemMetrics.server.networkLatency}ms</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-${getStatusColor(systemMetrics.database.status)}-100 dark:bg-${getStatusColor(systemMetrics.database.status)}-900/20`}>
              <Database className={`text-${getStatusColor(systemMetrics.database.status)}-600 dark:text-${getStatusColor(systemMetrics.database.status)}-400`} size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Banco de Dados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className={`font-medium text-${getStatusColor(systemMetrics.database.status)}-600`}>
                  {systemMetrics.database.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conexões</span>
              <span className="font-medium">{systemMetrics.database.connections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tempo de Query</span>
              <span className="font-medium">{systemMetrics.database.queryTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
              <span className="font-medium">{systemMetrics.database.cacheHitRate}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-${getStatusColor(systemMetrics.application.status)}-100 dark:bg-${getStatusColor(systemMetrics.application.status)}-900/20`}>
              <Activity className={`text-${getStatusColor(systemMetrics.application.status)}-600 dark:text-${getStatusColor(systemMetrics.application.status)}-400`} size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Aplicação</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className={`font-medium text-${getStatusColor(systemMetrics.application.status)}-600`}>
                  {systemMetrics.application.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</span>
              <span className="font-medium">{systemMetrics.application.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Req/min</span>
              <span className="font-medium">{systemMetrics.application.requestsPerMinute}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Erro</span>
              <span className="font-medium">{systemMetrics.application.errorRate.toFixed(2)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Uso de CPU</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
              <span className="font-medium">{systemMetrics.server.cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  systemMetrics.server.cpuUsage > 80 ? 'bg-red-500' :
                  systemMetrics.server.cpuUsage > 60 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${systemMetrics.server.cpuUsage}%` }}
              />
            </div>
          </div>
          <AdminChart
            type="line"
            data={systemMetrics.performance.cpuHistory}
            xKey="time"
            yKey="value"
            height={200}
            color="#3B82F6"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Uso de Memória</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
              <span className="font-medium">{systemMetrics.server.memoryUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  systemMetrics.server.memoryUsage > 80 ? 'bg-red-500' :
                  systemMetrics.server.memoryUsage > 60 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${systemMetrics.server.memoryUsage}%` }}
              />
            </div>
          </div>
          <AdminChart
            type="line"
            data={systemMetrics.performance.memoryHistory}
            xKey="time"
            yKey="value"
            height={200}
            color="#10B981"
          />
        </Card>
      </div>

      {/* Tempo de Resposta */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tempo de Resposta da Aplicação</h3>
        <AdminChart
          type="line"
          data={systemMetrics.performance.responseTimeHistory}
          xKey="time"
          yKey="value"
          height={250}
          color="#F59E0B"
        />
      </Card>
    </div>
  )

  const renderDetailed = () => (
    <div className="space-y-6">
      {/* Métricas Detalhadas do Servidor */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Métricas Detalhadas do Servidor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminMetricCard
            title="CPU Usage"
            value={systemMetrics.server.cpuUsage}
            icon={Cpu}
            color="blue"
            format="percentage"
            suffix="%"
          />
          <AdminMetricCard
            title="Memory Usage"
            value={systemMetrics.server.memoryUsage}
            icon={HardDrive}
            color="green"
            format="percentage"
            suffix="%"
          />
          <AdminMetricCard
            title="Disk Usage"
            value={systemMetrics.server.diskUsage}
            icon={Database}
            color="yellow"
            format="percentage"
            suffix="%"
          />
          <AdminMetricCard
            title="Network Latency"
            value={systemMetrics.server.networkLatency}
            icon={Wifi}
            color="purple"
            format="number"
            suffix="ms"
          />
        </div>
      </Card>

      {/* Métricas da Aplicação */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Métricas da Aplicação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminMetricCard
            title="Active Users"
            value={systemMetrics.application.activeUsers}
            icon={Activity}
            color="blue"
            format="number"
          />
          <AdminMetricCard
            title="Requests/min"
            value={systemMetrics.application.requestsPerMinute}
            icon={Zap}
            color="green"
            format="number"
          />
          <AdminMetricCard
            title="Error Rate"
            value={systemMetrics.application.errorRate}
            icon={AlertTriangle}
            color="red"
            format="percentage"
            suffix="%"
          />
          <AdminMetricCard
            title="Response Time"
            value={systemMetrics.application.responseTime}
            icon={Clock}
            color="yellow"
            format="number"
            suffix="ms"
          />
        </div>
      </Card>

      {/* Gráficos Detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Throughput</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {systemMetrics.application.throughput.toFixed(2)}
            </div>
            <p className="text-gray-600 dark:text-gray-400">MB/s</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Database Size</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {systemMetrics.database.size}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Size</p>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderAlerts = () => (
    <div className="space-y-6">
      {/* Alertas Ativos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Alertas do Sistema</h3>
        <div className="space-y-4">
          {systemMetrics.alerts.map(alert => {
            const Icon = getStatusIcon(alert.type)
            const color = getStatusColor(alert.type)
            const severityColor = getSeverityColor(alert.severity)
            
            return (
              <div key={alert.id} className={`p-4 border-l-4 border-${color}-500 bg-${color}-50 dark:bg-${color}-900/10 rounded-r-lg`}>
                <div className="flex items-start gap-3">
                  <Icon className={`text-${color}-600 dark:text-${color}-400 mt-1`} size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge color={severityColor} size="sm">
                        {alert.severity}
                      </Badge>
                      <Badge color={alert.status === 'active' ? 'red' : alert.status === 'resolved' ? 'green' : 'blue'} size="sm">
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {alert.status === 'active' && (
                      <Button size="sm" variant="outline">
                        Resolver
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Configurações de Alertas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configurações de Alertas</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CPU Usage Threshold</label>
              <Input
                type="number"
                placeholder="80"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Memory Usage Threshold</label>
              <Input
                type="number"
                placeholder="85"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Response Time Threshold (ms)</label>
              <Input
                type="number"
                placeholder="500"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Error Rate Threshold (%)</label>
              <Input
                type="number"
                placeholder="5"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>
              <Save size={16} />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Monitoramento do Sistema
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Acompanhe a performance e saúde do sistema em tempo real
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
              Auto Refresh
            </Button>
            <Button
              onClick={carregarMetricas}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-sm font-medium">Período:</span>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Visualização:</span>
              <div className="flex gap-1">
                {viewModes.map(mode => (
                  <Button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value)}
                    variant={viewMode === mode.value ? "default" : "outline"}
                    size="sm"
                  >
                    <mode.icon size={16} />
                    {mode.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Refresh:</span>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1min</option>
                <option value={300}>5min</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Conteúdo Principal */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        ) : (
          <>
            {viewMode === 'overview' && renderOverview()}
            {viewMode === 'detailed' && renderDetailed()}
            {viewMode === 'alerts' && renderAlerts()}
          </>
        )}

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
    </AdminLayout>
  )
}

export default MonitoramentoAdmin
