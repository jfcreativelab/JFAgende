import { useState, useEffect } from 'react'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Mail, 
  Smartphone, 
  Globe, 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  Database, 
  Server, 
  Zap, 
  Clock, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  RefreshCw, 
  Download, 
  Upload, 
  Archive, 
  Star, 
  Heart, 
  MessageCircle, 
  Phone, 
  Video, 
  Camera, 
  Image as ImageIcon, 
  File, 
  FileText, 
  Link, 
  ExternalLink, 
  Copy, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Bookmark, 
  Tag, 
  Hash, 
  AtSign, 
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
  RotateCcw, 
  Save, 
  X, 
  Check, 
  Plus as PlusIcon, 
  Minus, 
  Play, 
  Pause, 
  Stop, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Headphones, 
  Speaker, 
  Radio, 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalZero, 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  BatteryHigh, 
  BatteryFull, 
  Power, 
  PowerOff, 
  Lock, 
  Unlock, 
  Key, 
  Fingerprint, 
  Scan, 
  QrCode, 
  Barcode, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Coins, 
  Receipt, 
  Calculator, 
  Percent, 
  Hash as HashIcon, 
  AtSign as AtSignIcon, 
  Plus as PlusIcon2, 
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
  DollarSign as DollarIcon, 
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

const NotificacoesAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // all, unread, read, critical
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState([])

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    channels: ['in-app'],
    targetUsers: 'all',
    scheduledFor: null,
    expiresAt: null
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    criticalAlerts: true,
    digestFrequency: 'daily',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })

  const notificationTypes = [
    { value: 'info', label: 'Informativa', icon: Info, color: 'blue' },
    { value: 'success', label: 'Sucesso', icon: CheckCircle, color: 'green' },
    { value: 'warning', label: 'Aviso', icon: AlertTriangle, color: 'yellow' },
    { value: 'error', label: 'Erro', icon: XCircle, color: 'red' },
    { value: 'critical', label: 'Crítica', icon: Shield, color: 'purple' }
  ]

  const priorityLevels = [
    { value: 'low', label: 'Baixa', color: 'gray' },
    { value: 'medium', label: 'Média', color: 'blue' },
    { value: 'high', label: 'Alta', color: 'orange' },
    { value: 'urgent', label: 'Urgente', color: 'red' }
  ]

  const channels = [
    { value: 'in-app', label: 'No App', icon: Bell },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'push', label: 'Push', icon: Smartphone },
    { value: 'sms', label: 'SMS', icon: MessageCircle }
  ]

  const targetOptions = [
    { value: 'all', label: 'Todos os Usuários' },
    { value: 'admins', label: 'Apenas Admins' },
    { value: 'estabelecimentos', label: 'Estabelecimentos' },
    { value: 'clientes', label: 'Clientes' },
    { value: 'custom', label: 'Usuários Específicos' }
  ]

  useEffect(() => {
    carregarNotificacoes()
  }, [filter])

  const carregarNotificacoes = async () => {
    setLoading(true)
    try {
      // Simular dados de notificações
      const dadosSimulados = [
        {
          id: 1,
          title: 'Sistema de Backup Concluído',
          message: 'O backup automático do sistema foi executado com sucesso. Todos os dados foram salvos.',
          type: 'success',
          priority: 'medium',
          channels: ['in-app', 'email'],
          targetUsers: 'admins',
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
          readAt: null,
          sentAt: new Date(Date.now() - 1000 * 60 * 30),
          status: 'sent',
          read: false
        },
        {
          id: 2,
          title: 'Alta Demanda no Servidor',
          message: 'O servidor está com 85% de utilização. Considere escalar os recursos.',
          type: 'warning',
          priority: 'high',
          channels: ['in-app', 'email', 'push'],
          targetUsers: 'admins',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
          readAt: new Date(Date.now() - 1000 * 60 * 60), // 1h atrás
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'sent',
          read: true
        },
        {
          id: 3,
          title: 'Falha na Integração WhatsApp',
          message: 'A integração com WhatsApp apresentou falha. Verifique as configurações.',
          type: 'error',
          priority: 'urgent',
          channels: ['in-app', 'email', 'push', 'sms'],
          targetUsers: 'admins',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4h atrás
          readAt: null,
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          status: 'sent',
          read: false
        },
        {
          id: 4,
          title: 'Novo Estabelecimento Cadastrado',
          message: 'Salão Beleza & Cia foi cadastrado e está aguardando aprovação.',
          type: 'info',
          priority: 'medium',
          channels: ['in-app'],
          targetUsers: 'admins',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6h atrás
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h atrás
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          status: 'sent',
          read: true
        },
        {
          id: 5,
          title: 'Relatório Mensal Disponível',
          message: 'O relatório de performance do mês de dezembro está disponível para download.',
          type: 'info',
          priority: 'low',
          channels: ['in-app', 'email'],
          targetUsers: 'admins',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20h atrás
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          status: 'sent',
          read: true
        },
        {
          id: 6,
          title: 'Atualização de Segurança Disponível',
          message: 'Uma nova atualização de segurança está disponível. Recomendamos instalar imediatamente.',
          type: 'critical',
          priority: 'urgent',
          channels: ['in-app', 'email', 'push'],
          targetUsers: 'admins',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 40), // 40h atrás
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
          status: 'sent',
          read: true
        }
      ]

      setNotifications(dadosSimulados)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      setToast({ type: 'error', message: 'Erro ao carregar notificações' })
    } finally {
      setLoading(false)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      (filter === 'critical' && notification.type === 'critical')
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true, readAt: new Date() }
        : notification
    ))
  }

  const markAsUnread = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: false, readAt: null }
        : notification
    ))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
    setToast({ type: 'success', message: 'Notificação removida' })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      notification.read ? notification : { ...notification, read: true, readAt: new Date() }
    ))
    setToast({ type: 'success', message: 'Todas as notificações foram marcadas como lidas' })
  }

  const createNotification = async () => {
    try {
      const notification = {
        id: Date.now(),
        ...newNotification,
        createdAt: new Date(),
        readAt: null,
        sentAt: newNotification.scheduledFor ? new Date(newNotification.scheduledFor) : new Date(),
        status: 'sent',
        read: false
      }
      
      setNotifications([notification, ...notifications])
      setShowCreateModal(false)
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        channels: ['in-app'],
        targetUsers: 'all',
        scheduledFor: null,
        expiresAt: null
      })
      setToast({ type: 'success', message: 'Notificação criada com sucesso' })
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao criar notificação' })
    }
  }

  const getNotificationIcon = (type) => {
    const notificationType = notificationTypes.find(t => t.value === type)
    return notificationType ? notificationType.icon : Info
  }

  const getNotificationColor = (type) => {
    const notificationType = notificationTypes.find(t => t.value === type)
    return notificationType ? notificationType.color : 'blue'
  }

  const getPriorityColor = (priority) => {
    const priorityLevel = priorityLevels.find(p => p.value === priority)
    return priorityLevel ? priorityLevel.color : 'gray'
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} dias atrás`
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Centro de Notificações
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie notificações do sistema e comunique-se com usuários
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              size="sm"
            >
              <Settings size={16} />
              Configurações
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
            >
              <Plus size={16} />
              Nova Notificação
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Bell className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Não Lidas</p>
                <p className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Shield className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Críticas</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'critical').length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enviadas Hoje</p>
                <p className="text-2xl font-bold">{notifications.filter(n => {
                  const today = new Date()
                  const notificationDate = new Date(n.createdAt)
                  return notificationDate.toDateString() === today.toDateString()
                }).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="all">Todas</option>
                <option value="unread">Não Lidas</option>
                <option value="read">Lidas</option>
                <option value="critical">Críticas</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <Search size={16} />
              <Input
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
            >
              <CheckCircle size={16} />
              Marcar Todas como Lidas
            </Button>
          </div>
        </Card>

        {/* Lista de Notificações */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Não há notificações que correspondam aos filtros selecionados.
              </p>
            </Card>
          ) : (
            filteredNotifications.map(notification => {
              const Icon = getNotificationIcon(notification.type)
              const color = getNotificationColor(notification.type)
              const priorityColor = getPriorityColor(notification.priority)
              
              return (
                <Card key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                      <Icon className={`text-${color}-600 dark:text-${color}-400`} size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge color={priorityColor} size="sm">
                              {notification.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatTimeAgo(notification.createdAt)}</span>
                            <span>•</span>
                            <span>{notification.channels.join(', ')}</span>
                            <span>•</span>
                            <span>{notification.targetUsers}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {notification.read ? (
                            <Button
                              onClick={() => markAsUnread(notification.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <EyeOff size={16} />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Eye size={16} />
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Modal de Criar Notificação */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nova Notificação"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Digite o título da notificação"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mensagem</label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                placeholder="Digite a mensagem da notificação"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 resize-none"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Prioridade</label>
                <select
                  value={newNotification.priority}
                  onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Canais</label>
              <div className="flex gap-2">
                {channels.map(channel => (
                  <label key={channel.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newNotification.channels.includes(channel.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification({
                            ...newNotification,
                            channels: [...newNotification.channels, channel.value]
                          })
                        } else {
                          setNewNotification({
                            ...newNotification,
                            channels: newNotification.channels.filter(c => c !== channel.value)
                          })
                        }
                      }}
                    />
                    <channel.icon size={16} />
                    {channel.label}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Público Alvo</label>
              <select
                value={newNotification.targetUsers}
                onChange={(e) => setNewNotification({...newNotification, targetUsers: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {targetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={createNotification}
                disabled={!newNotification.title || !newNotification.message}
              >
                <Send size={16} />
                Enviar Notificação
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal de Configurações */}
        <Modal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="Configurações de Notificação"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Canais de Notificação</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  />
                  <Mail size={16} />
                  <span>Notificações por Email</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                  />
                  <Smartphone size={16} />
                  <span>Notificações Push</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                  />
                  <MessageCircle size={16} />
                  <span>Notificações SMS</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.criticalAlerts}
                    onChange={(e) => setSettings({...settings, criticalAlerts: e.target.checked})}
                  />
                  <Shield size={16} />
                  <span>Alertas Críticos</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Frequência de Resumo</h3>
              <select
                value={settings.digestFrequency}
                onChange={(e) => setSettings({...settings, digestFrequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="realtime">Tempo Real</option>
                <option value="hourly">A cada Hora</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Horário Silencioso</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.quietHours.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      quietHours: {...settings.quietHours, enabled: e.target.checked}
                    })}
                  />
                  <span>Ativar horário silencioso</span>
                </label>
                
                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Início</label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => setSettings({
                          ...settings,
                          quietHours: {...settings.quietHours, start: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fim</label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => setSettings({
                          ...settings,
                          quietHours: {...settings.quietHours, end: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowSettingsModal(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setShowSettingsModal(false)
                  setToast({ type: 'success', message: 'Configurações salvas' })
                }}
              >
                <Save size={16} />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </Modal>

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

export default NotificacoesAdmin
