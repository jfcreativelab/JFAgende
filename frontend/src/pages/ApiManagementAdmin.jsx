import { useState, useEffect } from 'react'
import { 
  Code, 
  Key, 
  Shield, 
  Activity, 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  Settings, 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Star, 
  Award, 
  Gift, 
  Tag, 
  Percent, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Monitor, 
  Globe, 
  MapPin, 
  User, 
  UserCheck, 
  UserX, 
  UserPlus, 
  RefreshCw, 
  Play, 
  Pause, 
  Stop, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Save, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Maximize2, 
  Minimize2, 
  MoreVertical, 
  MoreHorizontal, 
  Grid, 
  List, 
  Layout, 
  Palette, 
  Image as ImageIcon, 
  Video, 
  File, 
  FileText, 
  Folder, 
  FolderOpen, 
  Link, 
  Hash, 
  AtSign, 
  Phone, 
  Camera, 
  Mic, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Speaker, 
  Radio, 
  Tv, 
  Laptop, 
  Tablet, 
  Watch, 
  Gamepad2, 
  Joystick, 
  Controller, 
  Keyboard, 
  Mouse, 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  Signal, 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  BatteryFull, 
  Zap, 
  Lock, 
  Unlock, 
  Fingerprint, 
  Scan, 
  QrCode, 
  Database, 
  Server, 
  Cloud, 
  CloudOff, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Disc, 
  Disc3, 
  Cd, 
  Dvd, 
  FloppyDisk, 
  Usb, 
  SdCard, 
  Plus, 
  Minus, 
  Equal, 
  Divide, 
  Multiply, 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  Octagon, 
  Diamond, 
  Heart, 
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
  ThumbsUp, 
  ThumbsDown, 
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
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Maximize2 as Maximize2Icon, 
  Minimize2 as Minimize2Icon, 
  MoreVertical as MoreVerticalIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  Grid as GridIcon, 
  List as ListIcon, 
  Layout as LayoutIcon, 
  Palette as PaletteIcon, 
  Image as ImageIcon2, 
  Video as VideoIcon, 
  File as FileIcon, 
  FileText as FileTextIcon, 
  Folder as FolderIcon, 
  FolderOpen as FolderOpenIcon, 
  Link as LinkIcon, 
  Hash as HashIcon, 
  AtSign as AtSignIcon, 
  Phone as PhoneIcon, 
  Camera as CameraIcon, 
  Mic as MicIcon, 
  Volume2 as Volume2Icon, 
  VolumeX as VolumeXIcon, 
  Headphones as HeadphonesIcon, 
  Speaker as SpeakerIcon, 
  Radio as RadioIcon, 
  Tv as TvIcon, 
  Laptop as LaptopIcon, 
  Tablet as TabletIcon, 
  Watch as WatchIcon, 
  Gamepad2 as Gamepad2Icon, 
  Joystick as JoystickIcon, 
  Controller as ControllerIcon, 
  Keyboard as KeyboardIcon, 
  Mouse as MouseIcon, 
  Wifi as WifiIcon, 
  WifiOff as WifiOffIcon, 
  Bluetooth as BluetoothIcon, 
  Signal as SignalIcon, 
  Battery as BatteryIcon, 
  BatteryLow as BatteryLowIcon, 
  BatteryMedium as BatteryMediumIcon, 
  BatteryFull as BatteryFullIcon, 
  Zap as ZapIcon, 
  Shield as ShieldIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Key as KeyIcon, 
  Fingerprint as FingerprintIcon, 
  Scan as ScanIcon, 
  QrCode as QrCodeIcon, 
  Database as DatabaseIcon, 
  Server as ServerIcon, 
  Cloud as CloudIcon, 
  CloudOff as CloudOffIcon, 
  HardDrive as HardDriveIcon, 
  Cpu as CpuIcon, 
  MemoryStick as MemoryStickIcon, 
  Disc as DiscIcon, 
  Disc3 as Disc3Icon, 
  Cd as CdIcon, 
  Dvd as DvdIcon, 
  FloppyDisk as FloppyDiskIcon, 
  Usb as UsbIcon, 
  SdCard as SdCardIcon
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import AdminMetricCard from '../components/AdminMetricCard'
import AdminChart from '../components/AdminChart'

const ApiManagementAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, keys, endpoints, rate-limits, docs
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [showEndpointModal, setShowEndpointModal] = useState(false)
  const [showRateLimitModal, setShowRateLimitModal] = useState(false)

  const [apiStats, setApiStats] = useState({
    totalRequests: 0,
    activeKeys: 0,
    totalEndpoints: 0,
    averageResponseTime: 0,
    errorRate: 0,
    successRate: 0,
    totalBandwidth: 0,
    peakRequests: 0,
    uptime: 0,
    lastUpdated: new Date()
  })

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Frontend App',
      key: 'jfag_sk_live_1234567890abcdef',
      type: 'secret',
      status: 'active',
      permissions: ['read', 'write'],
      rateLimit: 1000,
      usedRequests: 450,
      lastUsed: new Date(Date.now() - 1000 * 60 * 30),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      description: 'Chave para aplicação frontend principal'
    },
    {
      id: 2,
      name: 'Mobile App',
      key: 'jfag_pk_live_abcdef1234567890',
      type: 'public',
      status: 'active',
      permissions: ['read'],
      rateLimit: 500,
      usedRequests: 200,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      description: 'Chave pública para aplicativo mobile'
    },
    {
      id: 3,
      name: 'Webhook Integration',
      key: 'jfag_wh_live_9876543210fedcba',
      type: 'webhook',
      status: 'inactive',
      permissions: ['webhook'],
      rateLimit: 100,
      usedRequests: 0,
      lastUsed: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      description: 'Chave para integração de webhooks'
    }
  ])

  const [endpoints, setEndpoints] = useState([
    {
      id: 1,
      path: '/api/auth/login',
      method: 'POST',
      status: 'active',
      rateLimit: 100,
      averageResponseTime: 150,
      successRate: 99.2,
      totalRequests: 15420,
      lastRequest: new Date(Date.now() - 1000 * 60 * 5),
      description: 'Endpoint de autenticação de usuários'
    },
    {
      id: 2,
      path: '/api/estabelecimentos',
      method: 'GET',
      status: 'active',
      rateLimit: 500,
      averageResponseTime: 200,
      successRate: 98.8,
      totalRequests: 25680,
      lastRequest: new Date(Date.now() - 1000 * 60 * 2),
      description: 'Listagem de estabelecimentos'
    },
    {
      id: 3,
      path: '/api/agendamentos',
      method: 'POST',
      status: 'active',
      rateLimit: 200,
      averageResponseTime: 300,
      successRate: 97.5,
      totalRequests: 8950,
      lastRequest: new Date(Date.now() - 1000 * 60 * 1),
      description: 'Criação de agendamentos'
    },
    {
      id: 4,
      path: '/api/admin/estatisticas',
      method: 'GET',
      status: 'maintenance',
      rateLimit: 50,
      averageResponseTime: 500,
      successRate: 95.0,
      totalRequests: 1200,
      lastRequest: new Date(Date.now() - 1000 * 60 * 60 * 2),
      description: 'Estatísticas administrativas'
    }
  ])

  const [rateLimits, setRateLimits] = useState([
    {
      id: 1,
      name: 'Free Tier',
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      burstLimit: 100,
      status: 'active',
      description: 'Limite para usuários gratuitos'
    },
    {
      id: 2,
      name: 'Premium Tier',
      requestsPerMinute: 300,
      requestsPerHour: 5000,
      requestsPerDay: 50000,
      burstLimit: 500,
      status: 'active',
      description: 'Limite para usuários premium'
    },
    {
      id: 3,
      name: 'Enterprise Tier',
      requestsPerMinute: 1000,
      requestsPerHour: 20000,
      requestsPerDay: 200000,
      burstLimit: 2000,
      status: 'active',
      description: 'Limite para usuários enterprise'
    }
  ])

  const [requestLogs, setRequestLogs] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      method: 'POST',
      path: '/api/auth/login',
      statusCode: 200,
      responseTime: 145,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      apiKey: 'jfag_sk_live_1234567890abcdef',
      userId: 'user_123'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      method: 'GET',
      path: '/api/estabelecimentos',
      statusCode: 200,
      responseTime: 180,
      ipAddress: '192.168.1.101',
      userAgent: 'JFAgende-Mobile/1.0.0',
      apiKey: 'jfag_pk_live_abcdef1234567890',
      userId: 'user_456'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      method: 'POST',
      path: '/api/agendamentos',
      statusCode: 400,
      responseTime: 250,
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      apiKey: 'jfag_sk_live_1234567890abcdef',
      userId: 'user_789'
    }
  ])

  const [usageData, setUsageData] = useState([
    { hour: '00:00', requests: 120, errors: 2 },
    { hour: '01:00', requests: 80, errors: 1 },
    { hour: '02:00', requests: 60, errors: 0 },
    { hour: '03:00', requests: 45, errors: 1 },
    { hour: '04:00', requests: 50, errors: 0 },
    { hour: '05:00', requests: 70, errors: 1 },
    { hour: '06:00', requests: 150, errors: 3 },
    { hour: '07:00', requests: 300, errors: 5 },
    { hour: '08:00', requests: 500, errors: 8 },
    { hour: '09:00', requests: 750, errors: 12 },
    { hour: '10:00', requests: 900, errors: 15 },
    { hour: '11:00', requests: 850, errors: 10 },
    { hour: '12:00', requests: 800, errors: 8 },
    { hour: '13:00', requests: 700, errors: 6 },
    { hour: '14:00', requests: 750, errors: 7 },
    { hour: '15:00', requests: 800, errors: 9 },
    { hour: '16:00', requests: 850, errors: 11 },
    { hour: '17:00', requests: 900, errors: 13 },
    { hour: '18:00', requests: 750, errors: 10 },
    { hour: '19:00', requests: 600, errors: 7 },
    { hour: '20:00', requests: 400, errors: 4 },
    { hour: '21:00', requests: 300, errors: 3 },
    { hour: '22:00', requests: 200, errors: 2 },
    { hour: '23:00', requests: 150, errors: 1 }
  ])

  const keyTypes = [
    { value: 'secret', label: 'Secret Key', color: 'red' },
    { value: 'public', label: 'Public Key', color: 'blue' },
    { value: 'webhook', label: 'Webhook Key', color: 'purple' },
    { value: 'admin', label: 'Admin Key', color: 'orange' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Ativo', color: 'green' },
    { value: 'inactive', label: 'Inativo', color: 'gray' },
    { value: 'suspended', label: 'Suspenso', color: 'red' },
    { value: 'expired', label: 'Expirado', color: 'yellow' }
  ]

  const httpMethods = [
    { value: 'GET', label: 'GET', color: 'green' },
    { value: 'POST', label: 'POST', color: 'blue' },
    { value: 'PUT', label: 'PUT', color: 'orange' },
    { value: 'DELETE', label: 'DELETE', color: 'red' },
    { value: 'PATCH', label: 'PATCH', color: 'purple' }
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados da API
      const stats = {
        totalRequests: 125680,
        activeKeys: 8,
        totalEndpoints: 24,
        averageResponseTime: 185,
        errorRate: 2.3,
        successRate: 97.7,
        totalBandwidth: 2.5,
        peakRequests: 1200,
        uptime: 99.9,
        lastUpdated: new Date()
      }
      setApiStats(stats)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados da API' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return statusConfig ? statusConfig.color : 'gray'
  }

  const getKeyTypeColor = (type) => {
    const typeConfig = keyTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.color : 'gray'
  }

  const getMethodColor = (method) => {
    const methodConfig = httpMethods.find(m => m.value === method)
    return methodConfig ? methodConfig.color : 'gray'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const maskApiKey = (key) => {
    if (!key) return ''
    return key.substring(0, 8) + '...' + key.substring(key.length - 8)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Total de Requisições"
          value={apiStats.totalRequests}
          icon={Activity}
          color="blue"
          format="number"
          change={12.5}
          changeType="positive"
        />
        <AdminMetricCard
          title="Chaves Ativas"
          value={apiStats.activeKeys}
          icon={Key}
          color="green"
          format="number"
        />
        <AdminMetricCard
          title="Tempo Médio de Resposta"
          value={apiStats.averageResponseTime}
          icon={Clock}
          color="purple"
          format="number"
          suffix="ms"
          change={-5.2}
          changeType="positive"
        />
        <AdminMetricCard
          title="Taxa de Sucesso"
          value={apiStats.successRate}
          icon={CheckCircle}
          color="green"
          format="number"
          suffix="%"
          change={0.8}
          changeType="positive"
        />
      </div>

      {/* Gráfico de Uso */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Uso da API por Hora</h3>
        <AdminChart
          type="line"
          data={usageData}
          xKey="hour"
          yKey="requests"
          height={300}
          color="#3B82F6"
        />
      </Card>

      {/* Endpoints Mais Usados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Endpoints Mais Usados</h3>
        <div className="space-y-3">
          {endpoints.slice(0, 5).map(endpoint => (
            <div key={endpoint.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge color={getMethodColor(endpoint.method)} size="sm">
                  {endpoint.method}
                </Badge>
                <span className="font-medium">{endpoint.path}</span>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatNumber(endpoint.totalRequests)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {endpoint.averageResponseTime}ms
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderKeys = () => (
    <div className="space-y-6">
      {/* Lista de Chaves API */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Chaves de API</h3>
          <Button
            onClick={() => setShowKeyModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Nova Chave
          </Button>
        </div>

        <div className="space-y-4">
          {apiKeys.map(key => (
            <div key={key.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Key className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{key.name}</h4>
                      <Badge color={getKeyTypeColor(key.type)} size="sm">
                        {key.type}
                      </Badge>
                      <Badge color={getStatusColor(key.status)} size="sm">
                        {key.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {key.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Chave</p>
                        <p className="font-mono text-xs">{maskApiKey(key.key)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Limite</p>
                        <p className="font-medium">{formatNumber(key.rateLimit)}/hora</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Usado</p>
                        <p className="font-medium">{formatNumber(key.usedRequests)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Último Uso</p>
                        <p className="font-medium">
                          {key.lastUsed ? formatDate(key.lastUsed) : 'Nunca'}
                        </p>
                      </div>
                    </div>
                    {key.rateLimit > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uso da cota</span>
                          <span>{((key.usedRequests / key.rateLimit) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((key.usedRequests / key.rateLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Copy size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderEndpoints = () => (
    <div className="space-y-6">
      {/* Lista de Endpoints */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Endpoints da API</h3>
          <Button
            onClick={() => setShowEndpointModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Endpoint
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Método</th>
                <th className="text-left py-3 px-4 font-medium">Caminho</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Requisições</th>
                <th className="text-left py-3 px-4 font-medium">Tempo Médio</th>
                <th className="text-left py-3 px-4 font-medium">Taxa de Sucesso</th>
                <th className="text-left py-3 px-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(endpoint => (
                <tr key={endpoint.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <Badge color={getMethodColor(endpoint.method)} size="sm">
                      {endpoint.method}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{endpoint.path}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {endpoint.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge color={getStatusColor(endpoint.status)} size="sm">
                      {endpoint.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatNumber(endpoint.totalRequests)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{endpoint.averageResponseTime}ms</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{endpoint.successRate}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${endpoint.successRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const renderRateLimits = () => (
    <div className="space-y-6">
      {/* Lista de Rate Limits */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Rate Limits</h3>
          <Button
            onClick={() => setShowRateLimitModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Rate Limit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rateLimits.map(limit => (
            <div key={limit.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{limit.name}</h4>
                <Badge color={getStatusColor(limit.status)} size="sm">
                  {limit.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {limit.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Por minuto:</span>
                  <span className="font-medium">{formatNumber(limit.requestsPerMinute)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Por hora:</span>
                  <span className="font-medium">{formatNumber(limit.requestsPerHour)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Por dia:</span>
                  <span className="font-medium">{formatNumber(limit.requestsPerDay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Burst limit:</span>
                  <span className="font-medium">{formatNumber(limit.burstLimit)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit size={14} />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings size={14} />
                  Configurar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderDocs = () => (
    <div className="space-y-6">
      {/* Documentação da API */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Documentação da API</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Base URL
            </h4>
            <code className="text-blue-800 dark:text-blue-200">
              https://jfagende-production.up.railway.app/api
            </code>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Autenticação
            </h4>
            <p className="text-green-800 dark:text-green-200 text-sm mb-2">
              Use o header Authorization com sua chave API:
            </p>
            <code className="text-green-800 dark:text-green-200 text-sm">
              Authorization: Bearer jfag_sk_live_1234567890abcdef
            </code>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Rate Limiting
            </h4>
            <p className="text-purple-800 dark:text-purple-200 text-sm">
              Limites de requisições por minuto, hora e dia conforme seu plano.
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
              Códigos de Status
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>200</span>
                <span className="text-orange-800 dark:text-orange-200">Sucesso</span>
              </div>
              <div className="flex justify-between">
                <span>400</span>
                <span className="text-orange-800 dark:text-orange-200">Erro de requisição</span>
              </div>
              <div className="flex justify-between">
                <span>401</span>
                <span className="text-orange-800 dark:text-orange-200">Não autorizado</span>
              </div>
              <div className="flex justify-between">
                <span>429</span>
                <span className="text-orange-800 dark:text-orange-200">Rate limit excedido</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Logs de Requisições */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Logs de Requisições Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium">Método</th>
                <th className="text-left py-3 px-4 font-medium">Caminho</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Tempo</th>
                <th className="text-left py-3 px-4 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {requestLogs.map(log => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge color={getMethodColor(log.method)} size="sm">
                      {log.method}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">{log.path}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      color={log.statusCode >= 200 && log.statusCode < 300 ? 'green' : 'red'} 
                      size="sm"
                    >
                      {log.statusCode}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{log.responseTime}ms</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              Gerenciamento de API
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie chaves de API, endpoints, rate limits e documentação
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={carregarDados}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </Button>
            <Button
              onClick={() => setShowKeyModal(true)}
              size="sm"
            >
              <Plus size={16} />
              Nova Chave
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'keys', label: 'Chaves API', icon: Key },
            { id: 'endpoints', label: 'Endpoints', icon: Code },
            { id: 'rate-limits', label: 'Rate Limits', icon: Shield },
            { id: 'docs', label: 'Documentação', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'keys' && renderKeys()}
            {activeTab === 'endpoints' && renderEndpoints()}
            {activeTab === 'rate-limits' && renderRateLimits()}
            {activeTab === 'docs' && renderDocs()}
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

export default ApiManagementAdmin
