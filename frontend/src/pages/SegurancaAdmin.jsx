import { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Users, 
  Key, 
  Fingerprint, 
  Scan, 
  QrCode, 
  Database, 
  Server, 
  Wifi, 
  WifiOff, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Clock, 
  RefreshCw, 
  Settings, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Copy, 
  ExternalLink, 
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
  Maximize2, 
  Minimize2, 
  Calendar, 
  File, 
  FileText, 
  Folder, 
  FolderOpen, 
  Cloud, 
  CloudOff, 
  Zap, 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Bell, 
  Mail, 
  Phone, 
  MessageCircle, 
  Camera, 
  Image as ImageIcon, 
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
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import AdminMetricCard from '../components/AdminMetricCard'

const SegurancaAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, threats, logs, policies, users
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [securityStats, setSecurityStats] = useState({
    threatLevel: 'low', // low, medium, high, critical
    activeThreats: 0,
    blockedAttempts: 0,
    securityScore: 85,
    lastScan: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
    nextScan: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6h
    vulnerabilities: 2,
    patches: 5,
    usersOnline: 12,
    suspiciousActivity: 1
  })

  const [threats, setThreats] = useState([
    {
      id: 1,
      type: 'brute_force',
      severity: 'medium',
      title: 'Tentativa de Força Bruta',
      description: 'Múltiplas tentativas de login falhadas detectadas',
      source: '192.168.1.100',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'blocked',
      action: 'IP bloqueado automaticamente'
    },
    {
      id: 2,
      type: 'suspicious_login',
      severity: 'low',
      title: 'Login Suspeito',
      description: 'Login de localização não reconhecida',
      source: 'São Paulo, SP',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'investigating',
      action: 'Enviado email de verificação'
    },
    {
      id: 3,
      type: 'data_breach',
      severity: 'high',
      title: 'Tentativa de Acesso a Dados Sensíveis',
      description: 'Tentativa de acesso não autorizado a dados de clientes',
      source: '10.0.0.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'blocked',
      action: 'Usuário suspenso'
    }
  ])

  const [securityLogs, setSecurityLogs] = useState([
    {
      id: 1,
      action: 'LOGIN_SUCCESS',
      user: 'admin@jfagende.com',
      ip: '192.168.1.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      details: 'Login bem-sucedido via painel admin'
    },
    {
      id: 2,
      action: 'PASSWORD_CHANGE',
      user: 'user@example.com',
      ip: '192.168.1.75',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      details: 'Senha alterada com sucesso'
    },
    {
      id: 3,
      action: 'PERMISSION_DENIED',
      user: 'guest@example.com',
      ip: '192.168.1.100',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      details: 'Tentativa de acesso negada - permissão insuficiente'
    },
    {
      id: 4,
      action: 'ACCOUNT_LOCKED',
      user: 'test@example.com',
      ip: '192.168.1.200',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      details: 'Conta bloqueada após 5 tentativas de login falhadas'
    }
  ])

  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Política de Senhas',
      description: 'Requisitos mínimos para senhas de usuários',
      status: 'active',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
      rules: [
        'Mínimo de 8 caracteres',
        'Pelo menos 1 letra maiúscula',
        'Pelo menos 1 letra minúscula',
        'Pelo menos 1 número',
        'Pelo menos 1 caractere especial'
      ]
    },
    {
      id: 2,
      name: 'Política de Bloqueio de Conta',
      description: 'Regras para bloqueio automático de contas',
      status: 'active',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48),
      rules: [
        'Bloqueio após 5 tentativas falhadas',
        'Tempo de bloqueio: 30 minutos',
        'Notificação por email obrigatória'
      ]
    },
    {
      id: 3,
      name: 'Política de Sessão',
      description: 'Configurações de tempo de sessão',
      status: 'active',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 72),
      rules: [
        'Tempo de sessão: 8 horas',
        'Renovação automática de token',
        'Logout automático por inatividade'
      ]
    }
  ])

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@jfagende.com',
      role: 'admin',
      status: 'online',
      lastLogin: new Date(Date.now() - 1000 * 60 * 10),
      ip: '192.168.1.50',
      location: 'São Paulo, SP',
      twoFactor: true,
      riskLevel: 'low'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@jfagende.com',
      role: 'user',
      status: 'online',
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      ip: '192.168.1.75',
      location: 'Rio de Janeiro, RJ',
      twoFactor: false,
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@jfagende.com',
      role: 'user',
      status: 'offline',
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
      ip: '192.168.1.100',
      location: 'Belo Horizonte, MG',
      twoFactor: true,
      riskLevel: 'low'
    }
  ])

  const threatTypes = [
    { value: 'brute_force', label: 'Força Bruta', icon: ShieldX, color: 'red' },
    { value: 'suspicious_login', label: 'Login Suspeito', icon: AlertTriangle, color: 'yellow' },
    { value: 'data_breach', label: 'Vazamento de Dados', icon: Database, color: 'red' },
    { value: 'malware', label: 'Malware', icon: Virus, color: 'red' },
    { value: 'phishing', label: 'Phishing', icon: Globe, color: 'orange' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Baixa', color: 'green' },
    { value: 'medium', label: 'Média', color: 'yellow' },
    { value: 'high', label: 'Alta', color: 'orange' },
    { value: 'critical', label: 'Crítica', color: 'red' }
  ]

  const userRoles = [
    { value: 'admin', label: 'Administrador', color: 'red' },
    { value: 'user', label: 'Usuário', color: 'blue' },
    { value: 'guest', label: 'Convidado', color: 'gray' }
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados de segurança
      console.log('Carregando dados de segurança...')
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados de segurança' })
    } finally {
      setLoading(false)
    }
  }

  const getThreatIcon = (type) => {
    const threatType = threatTypes.find(t => t.value === type)
    return threatType ? threatType.icon : AlertTriangle
  }

  const getThreatColor = (type) => {
    const threatType = threatTypes.find(t => t.value === type)
    return threatType ? threatType.color : 'gray'
  }

  const getSeverityColor = (severity) => {
    const severityLevel = severityLevels.find(s => s.value === severity)
    return severityLevel ? severityLevel.color : 'gray'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'blocked': return 'green'
      case 'investigating': return 'yellow'
      case 'resolved': return 'blue'
      case 'active': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'blocked': return ShieldCheck
      case 'investigating': return Clock
      case 'resolved': return CheckCircle
      case 'active': return AlertTriangle
      default: return Activity
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Nível de Ameaça"
          value={securityStats.threatLevel}
          icon={Shield}
          color={securityStats.threatLevel === 'low' ? 'green' : securityStats.threatLevel === 'medium' ? 'yellow' : 'red'}
          format="text"
        />
        <AdminMetricCard
          title="Pontuação de Segurança"
          value={securityStats.securityScore}
          icon={Target}
          color="blue"
          format="number"
          suffix="/100"
        />
        <AdminMetricCard
          title="Tentativas Bloqueadas"
          value={securityStats.blockedAttempts}
          icon={ShieldX}
          color="red"
          format="number"
        />
        <AdminMetricCard
          title="Usuários Online"
          value={securityStats.usersOnline}
          icon={Users}
          color="green"
          format="number"
        />
      </div>

      {/* Alertas de Segurança */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Alertas de Segurança</h3>
        <div className="space-y-3">
          {threats.slice(0, 3).map(threat => {
            const Icon = getThreatIcon(threat.type)
            const color = getThreatColor(threat.type)
            const severityColor = getSeverityColor(threat.severity)
            
            return (
              <div key={threat.id} className={`p-4 border-l-4 border-${color}-500 bg-${color}-50 dark:bg-${color}-900/10 rounded-r-lg`}>
                <div className="flex items-start gap-3">
                  <Icon className={`text-${color}-600 dark:text-${color}-400 mt-1`} size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{threat.title}</h4>
                      <Badge color={severityColor} size="sm">
                        {threat.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {threat.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Fonte: {threat.source}</span>
                      <span>•</span>
                      <span>{formatDate(threat.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {securityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <Activity className="text-blue-600 dark:text-blue-400" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.action.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {log.user} • {formatDate(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Usuários Ativos</h3>
          <div className="space-y-3">
            {users.filter(u => u.status === 'online').map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user.role} • {user.location}
                  </p>
                </div>
                <Badge color={user.riskLevel === 'low' ? 'green' : user.riskLevel === 'medium' ? 'yellow' : 'red'} size="sm">
                  {user.riskLevel}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const renderThreats = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todos os tipos</option>
              {threatTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todas as severidades</option>
              {severityLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="blocked">Bloqueado</option>
              <option value="investigating">Investigando</option>
              <option value="resolved">Resolvido</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} />
            <Input
              placeholder="Buscar ameaças..."
              className="flex-1"
            />
          </div>
        </div>
      </Card>

      {/* Lista de Ameaças */}
      <div className="space-y-4">
        {threats.map(threat => {
          const Icon = getThreatIcon(threat.type)
          const color = getThreatColor(threat.type)
          const severityColor = getSeverityColor(threat.severity)
          const statusColor = getStatusColor(threat.status)
          const StatusIcon = getStatusIcon(threat.status)
          
          return (
            <Card key={threat.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                    <Icon className={`text-${color}-600 dark:text-${color}-400`} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{threat.title}</h3>
                      <Badge color={severityColor} size="sm">
                        {threat.severity}
                      </Badge>
                      <Badge color={statusColor} size="sm">
                        {threat.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {threat.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Fonte: {threat.source}</span>
                      <span>•</span>
                      <span>{formatDate(threat.timestamp)}</span>
                      <span>•</span>
                      <span>Ação: {threat.action}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <ShieldCheck size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todas as ações</option>
              <option value="LOGIN_SUCCESS">Login Bem-sucedido</option>
              <option value="LOGIN_FAILED">Login Falhado</option>
              <option value="PASSWORD_CHANGE">Mudança de Senha</option>
              <option value="PERMISSION_DENIED">Permissão Negada</option>
              <option value="ACCOUNT_LOCKED">Conta Bloqueada</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} />
            <Input
              placeholder="Buscar logs..."
              className="flex-1"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
          >
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Lista de Logs */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Ação</th>
                <th className="text-left py-3 px-4 font-medium">Usuário</th>
                <th className="text-left py-3 px-4 font-medium">IP</th>
                <th className="text-left py-3 px-4 font-medium">Data/Hora</th>
                <th className="text-left py-3 px-4 font-medium">Detalhes</th>
                <th className="text-left py-3 px-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {securityLogs.map(log => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <Badge color="blue" size="sm">
                      {log.action.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">{log.user}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{log.ip}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {log.details}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const renderPolicies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Políticas de Segurança</h3>
        <Button
          onClick={() => setShowPolicyModal(true)}
          size="sm"
        >
          <Plus size={16} />
          Nova Política
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map(policy => (
          <Card key={policy.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-semibold">{policy.name}</h4>
              <Badge color={policy.status === 'active' ? 'green' : 'red'}>
                {policy.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {policy.description}
            </p>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Regras:</h5>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {policy.rules.map((rule, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Atualizado: {formatDate(policy.lastUpdated)}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todos os usuários</option>
              {userRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todos os status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} />
            <Input
              placeholder="Buscar usuários..."
              className="flex-1"
            />
          </div>
        </div>
      </Card>

      {/* Lista de Usuários */}
      <div className="space-y-4">
        {users.map(user => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <Badge color={user.status === 'online' ? 'green' : 'gray'} size="sm">
                      {user.status}
                    </Badge>
                    <Badge color={user.riskLevel === 'low' ? 'green' : user.riskLevel === 'medium' ? 'yellow' : 'red'} size="sm">
                      {user.riskLevel}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {user.email} • {user.role}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>IP: {user.ip}</span>
                    <span>•</span>
                    <span>{user.location}</span>
                    <span>•</span>
                    <span>Último login: {formatDate(user.lastLogin)}</span>
                    <span>•</span>
                    <span>2FA: {user.twoFactor ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setSelectedUser(user)
                    setShowUserModal(true)
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Eye size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Shield size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Lock size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Centro de Segurança
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitore ameaças, gerencie políticas de segurança e controle de acesso
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
              onClick={() => setShowPolicyModal(true)}
              size="sm"
            >
              <Shield size={16} />
              Nova Política
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'threats', label: 'Ameaças', icon: ShieldAlert },
            { id: 'logs', label: 'Logs', icon: FileText },
            { id: 'policies', label: 'Políticas', icon: Shield },
            { id: 'users', label: 'Usuários', icon: Users }
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
            {activeTab === 'threats' && renderThreats()}
            {activeTab === 'logs' && renderLogs()}
            {activeTab === 'policies' && renderPolicies()}
            {activeTab === 'users' && renderUsers()}
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

export default SegurancaAdmin
