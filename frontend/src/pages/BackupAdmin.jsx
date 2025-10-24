import { useState, useEffect } from 'react'
import { 
  Database,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Archive,
  Server,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Filter,
  Search,
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
  Wifi,
  WifiOff,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Bell,
  Mail,
  Phone,
  MessageCircle,
  Camera,
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
  Equal,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Asterisk,
  Ampersand,
  Euro
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

const BackupAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, backups, restore, settings
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState(null)

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily', // hourly, daily, weekly, monthly
    retentionDays: 30,
    compression: true,
    encryption: true,
    cloudStorage: true,
    localStorage: true,
    emailNotifications: true,
    maxFileSize: 1000, // MB
    excludeTables: [],
    includeFiles: true,
    includeDatabase: true,
    includeLogs: false
  })

  const [backups, setBackups] = useState([
    {
      id: 1,
      name: 'Backup Completo - 2024-01-15',
      type: 'full',
      size: '2.4 GB',
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      duration: '15 min',
      tables: 45,
      records: 125000,
      location: 'cloud',
      encrypted: true,
      compressed: true
    },
    {
      id: 2,
      name: 'Backup Incremental - 2024-01-14',
      type: 'incremental',
      size: '156 MB',
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      duration: '3 min',
      tables: 12,
      records: 8500,
      location: 'local',
      encrypted: true,
      compressed: true
    },
    {
      id: 3,
      name: 'Backup de Dados - 2024-01-13',
      type: 'data',
      size: '1.8 GB',
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 dias atrás
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      duration: '12 min',
      tables: 38,
      records: 98000,
      location: 'cloud',
      encrypted: true,
      compressed: true
    },
    {
      id: 4,
      name: 'Backup de Schema - 2024-01-12',
      type: 'schema',
      size: '45 MB',
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 dias atrás
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
      duration: '2 min',
      tables: 45,
      records: 0,
      location: 'local',
      encrypted: false,
      compressed: true
    },
    {
      id: 5,
      name: 'Backup Completo - 2024-01-11',
      type: 'full',
      size: '2.2 GB',
      status: 'failed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 dias atrás
      completedAt: null,
      duration: null,
      tables: 0,
      records: 0,
      location: 'cloud',
      encrypted: true,
      compressed: true,
      error: 'Falha na conexão com o servidor de backup'
    }
  ])

  const [backupStats, setBackupStats] = useState({
    totalBackups: 0,
    successfulBackups: 0,
    failedBackups: 0,
    totalSize: '0 GB',
    lastBackup: null,
    nextBackup: null,
    storageUsed: '0%',
    averageDuration: '0 min'
  })

  const backupTypes = [
    { value: 'full', label: 'Completo', description: 'Backup completo do banco de dados', icon: Database, color: 'blue' },
    { value: 'incremental', label: 'Incremental', description: 'Apenas dados alterados desde o último backup', icon: RefreshCw, color: 'green' },
    { value: 'differential', label: 'Diferencial', description: 'Dados alterados desde o último backup completo', icon: TrendingUp, color: 'yellow' },
    { value: 'schema', label: 'Schema', description: 'Apenas estrutura do banco de dados', icon: FileText, color: 'purple' },
    { value: 'data', label: 'Dados', description: 'Apenas dados das tabelas', icon: HardDrive, color: 'orange' }
  ]

  const frequencies = [
    { value: 'hourly', label: 'A cada hora' },
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' }
  ]

  const locations = [
    { value: 'local', label: 'Local', icon: HardDrive },
    { value: 'cloud', label: 'Nuvem', icon: Cloud },
    { value: 'both', label: 'Local + Nuvem', icon: Server }
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados de backup
      const stats = {
        totalBackups: backups.length,
        successfulBackups: backups.filter(b => b.status === 'completed').length,
        failedBackups: backups.filter(b => b.status === 'failed').length,
        totalSize: '6.6 GB',
        lastBackup: backups[0]?.createdAt || null,
        nextBackup: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12h
        storageUsed: '68%',
        averageDuration: '8 min'
      }
      setBackupStats(stats)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados de backup' })
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async (backupData) => {
    try {
      setLoading(true)
      // Simular criação de backup
      const newBackup = {
        id: Date.now(),
        name: backupData.name,
        type: backupData.type,
        size: '0 MB',
        status: 'running',
        createdAt: new Date(),
        completedAt: null,
        duration: null,
        tables: 0,
        records: 0,
        location: backupData.location,
        encrypted: backupData.encryption,
        compressed: backupData.compression
      }
      
      setBackups([newBackup, ...backups])
      setShowCreateModal(false)
      setToast({ type: 'success', message: 'Backup iniciado com sucesso' })
      
      // Simular conclusão do backup
      setTimeout(() => {
        setBackups(prev => prev.map(b => 
          b.id === newBackup.id 
            ? { 
                ...b, 
                status: 'completed', 
                completedAt: new Date(),
                size: '1.2 GB',
                duration: '8 min',
                tables: 45,
                records: 125000
              }
            : b
        ))
        setToast({ type: 'success', message: 'Backup concluído com sucesso' })
      }, 5000)
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao criar backup' })
    } finally {
      setLoading(false)
    }
  }

  const restoreBackup = async (backupId) => {
    try {
      setLoading(true)
      // Simular restauração
      setToast({ type: 'success', message: 'Restauração iniciada. Aguarde...' })
      
      setTimeout(() => {
        setToast({ type: 'success', message: 'Restauração concluída com sucesso' })
        setShowRestoreModal(false)
      }, 3000)
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao restaurar backup' })
    } finally {
      setLoading(false)
    }
  }

  const deleteBackup = async (backupId) => {
    try {
      setBackups(backups.filter(b => b.id !== backupId))
      setToast({ type: 'success', message: 'Backup removido com sucesso' })
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao remover backup' })
    }
  }

  const downloadBackup = async (backupId) => {
    try {
      const backup = backups.find(b => b.id === backupId)
      setToast({ type: 'success', message: `Download de ${backup.name} iniciado` })
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao fazer download do backup' })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green'
      case 'running': return 'blue'
      case 'failed': return 'red'
      case 'scheduled': return 'yellow'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'running': return RefreshCw
      case 'failed': return XCircle
      case 'scheduled': return Clock
      default: return AlertTriangle
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'full': return 'blue'
      case 'incremental': return 'green'
      case 'differential': return 'yellow'
      case 'schema': return 'purple'
      case 'data': return 'orange'
      default: return 'gray'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatFileSize = (size) => {
    return size
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Total de Backups"
          value={backupStats.totalBackups}
          icon={Database}
          color="blue"
          format="number"
        />
        <AdminMetricCard
          title="Backups Bem-sucedidos"
          value={backupStats.successfulBackups}
          icon={CheckCircle}
          color="green"
          format="number"
        />
        <AdminMetricCard
          title="Tamanho Total"
          value={backupStats.totalSize}
          icon={HardDrive}
          color="purple"
          format="text"
        />
        <AdminMetricCard
          title="Taxa de Sucesso"
          value={backupStats.totalBackups > 0 ? Math.round((backupStats.successfulBackups / backupStats.totalBackups) * 100) : 0}
          icon={Target}
          color="yellow"
          format="percentage"
          suffix="%"
        />
      </div>

      {/* Próximo Backup */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Próximo Backup Agendado</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="font-medium">Backup Automático</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {backupStats.nextBackup ? formatDate(backupStats.nextBackup) : 'Não agendado'}
              </p>
            </div>
          </div>
          <Badge color="blue">Agendado</Badge>
        </div>
      </Card>

      {/* Status do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Status do Armazenamento</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Uso do Disco</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{backupStats.storageUsed}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: backupStats.storageUsed }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Último Backup</p>
                <p className="font-medium">
                  {backupStats.lastBackup ? formatDate(backupStats.lastBackup) : 'Nunca'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Duração Média</p>
                <p className="font-medium">{backupStats.averageDuration}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configurações Atuais</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup Automático</span>
              <Badge color={backupSettings.autoBackup ? 'green' : 'red'}>
                {backupSettings.autoBackup ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Frequência</span>
              <span className="text-sm font-medium capitalize">{backupSettings.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Retenção</span>
              <span className="text-sm font-medium">{backupSettings.retentionDays} dias</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Criptografia</span>
              <Badge color={backupSettings.encryption ? 'green' : 'red'}>
                {backupSettings.encryption ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderBackups = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todos os tipos</option>
              {backupTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              <option value="all">Todos os status</option>
              <option value="completed">Concluído</option>
              <option value="running">Em execução</option>
              <option value="failed">Falhou</option>
              <option value="scheduled">Agendado</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} />
            <Input
              placeholder="Buscar backups..."
              className="flex-1"
            />
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Backup
          </Button>
        </div>
      </Card>

      {/* Lista de Backups */}
      <div className="space-y-4">
        {backups.map(backup => {
          const StatusIcon = getStatusIcon(backup.status)
          const statusColor = getStatusColor(backup.status)
          const typeColor = getTypeColor(backup.type)
          const backupType = backupTypes.find(t => t.value === backup.type)
          
          return (
            <Card key={backup.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-${statusColor}-100 dark:bg-${statusColor}-900/20`}>
                    <StatusIcon className={`text-${statusColor}-600 dark:text-${statusColor}-400`} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{backup.name}</h3>
                      <Badge color={typeColor} size="sm">
                        {backupType?.label}
                      </Badge>
                      <Badge color={statusColor} size="sm">
                        {backup.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatDate(backup.createdAt)}</span>
                      <span>•</span>
                      <span>{backup.size}</span>
                      <span>•</span>
                      <span>{backup.duration || 'N/A'}</span>
                      <span>•</span>
                      <span>{backup.tables} tabelas</span>
                      <span>•</span>
                      <span>{backup.records.toLocaleString()} registros</span>
                    </div>
                    
                    {backup.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Erro: {backup.error}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {backup.status === 'completed' && (
                    <>
                      <Button
                        onClick={() => downloadBackup(backup.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedBackup(backup)
                          setShowRestoreModal(true)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw size={16} />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    onClick={() => deleteBackup(backup.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderRestore = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Restaurar Backup</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Selecione um backup para restaurar. Esta ação irá substituir todos os dados atuais.
        </p>
        
        <div className="space-y-4">
          {backups.filter(b => b.status === 'completed').map(backup => (
            <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="text-blue-600" size={20} />
                <div>
                  <h4 className="font-medium">{backup.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(backup.createdAt)} • {backup.size} • {backup.tables} tabelas
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedBackup(backup)
                  setShowRestoreModal(true)
                }}
                variant="outline"
                size="sm"
              >
                <RotateCcw size={16} />
                Restaurar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configurações de Backup</h3>
        
        <div className="space-y-6">
          {/* Backup Automático */}
          <div>
            <h4 className="font-medium mb-3">Backup Automático</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) => setBackupSettings({...backupSettings, autoBackup: e.target.checked})}
                />
                <span>Ativar backup automático</span>
              </label>
              
              {backupSettings.autoBackup && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequência</label>
                    <select
                      value={backupSettings.frequency}
                      onChange={(e) => setBackupSettings({...backupSettings, frequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    >
                      {frequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Retenção (dias)</label>
                    <Input
                      type="number"
                      value={backupSettings.retentionDays}
                      onChange={(e) => setBackupSettings({...backupSettings, retentionDays: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Configurações de Backup */}
          <div>
            <h4 className="font-medium mb-3">Configurações de Backup</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Local de Armazenamento</label>
                <div className="space-y-2">
                  {locations.map(location => (
                    <label key={location.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="location"
                        value={location.value}
                        checked={backupSettings.location === location.value}
                        onChange={(e) => setBackupSettings({...backupSettings, location: e.target.value})}
                      />
                      <location.icon size={16} />
                      {location.label}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tamanho Máximo (MB)</label>
                <Input
                  type="number"
                  value={backupSettings.maxFileSize}
                  onChange={(e) => setBackupSettings({...backupSettings, maxFileSize: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {/* Opções Avançadas */}
          <div>
            <h4 className="font-medium mb-3">Opções Avançadas</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupSettings.compression}
                  onChange={(e) => setBackupSettings({...backupSettings, compression: e.target.checked})}
                />
                <span>Compressão</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupSettings.encryption}
                  onChange={(e) => setBackupSettings({...backupSettings, encryption: e.target.checked})}
                />
                <span>Criptografia</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupSettings.includeFiles}
                  onChange={(e) => setBackupSettings({...backupSettings, includeFiles: e.target.checked})}
                />
                <span>Incluir arquivos</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupSettings.includeDatabase}
                  onChange={(e) => setBackupSettings({...backupSettings, includeDatabase: e.target.checked})}
                />
                <span>Incluir banco de dados</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupSettings.includeLogs}
                  onChange={(e) => setBackupSettings({...backupSettings, includeLogs: e.target.checked})}
                />
                <span>Incluir logs</span>
              </label>
            </div>
          </div>

          {/* Notificações */}
          <div>
            <h4 className="font-medium mb-3">Notificações</h4>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={backupSettings.emailNotifications}
                onChange={(e) => setBackupSettings({...backupSettings, emailNotifications: e.target.checked})}
              />
              <span>Notificações por email</span>
            </label>
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
              Backup e Restauração
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie backups automáticos e restauração de dados do sistema
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
              Novo Backup
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'backups', label: 'Backups', icon: Database },
            { id: 'restore', label: 'Restaurar', icon: RotateCcw },
            { id: 'settings', label: 'Configurações', icon: Settings }
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
            {activeTab === 'backups' && renderBackups()}
            {activeTab === 'restore' && renderRestore()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}

        {/* Modal de Criar Backup */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Criar Novo Backup"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Backup</label>
              <Input
                placeholder="Ex: Backup Completo - 2024-01-15"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Backup</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {backupTypes.map(type => (
                  <label key={type.value} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input type="radio" name="backupType" value={type.value} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <type.icon className={`text-${type.color}-600`} size={16} />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Local</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  {locations.map(location => (
                    <option key={location.value} value={location.value}>{location.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Compressão</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  <option value="true">Ativada</option>
                  <option value="false">Desativada</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => createBackup({
                  name: 'Backup Manual - ' + new Date().toLocaleDateString(),
                  type: 'full',
                  location: 'local',
                  encryption: true,
                  compression: true
                })}
              >
                <Database size={16} />
                Criar Backup
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal de Restaurar */}
        <Modal
          isOpen={showRestoreModal}
          onClose={() => setShowRestoreModal(false)}
          title="Restaurar Backup"
          size="md"
        >
          {selectedBackup && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Atenção!</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Esta ação irá substituir todos os dados atuais. Certifique-se de que você tem um backup recente antes de continuar.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Detalhes do Backup</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600 dark:text-gray-400">Nome:</span> {selectedBackup.name}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Tipo:</span> {backupTypes.find(t => t.value === selectedBackup.type)?.label}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Tamanho:</span> {selectedBackup.size}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Data:</span> {formatDate(selectedBackup.createdAt)}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Tabelas:</span> {selectedBackup.tables}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Registros:</span> {selectedBackup.records.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  onClick={() => setShowRestoreModal(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => restoreBackup(selectedBackup.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RotateCcw size={16} />
                  Confirmar Restauração
                </Button>
              </div>
            </div>
          )}
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

export default BackupAdmin
