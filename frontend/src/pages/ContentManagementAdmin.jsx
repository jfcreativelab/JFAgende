import { useState, useEffect } from 'react'
import { 
  FileText,
  Video,
  Link,
  Globe,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
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
  Tag,
  Percent,
  DollarSign,
  Smartphone,
  Monitor,
  MapPin,
  User,
  RefreshCw,
  Play,
  Pause,
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
  Palette,
  Eye,
  EyeOff,
  Folder,
  FolderOpen,
  Hash,
  AtSign,
  Phone,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Headphones,
  Speaker,
  Laptop,
  Tablet,
  Keyboard,
  Mouse,
  Wifi,
  WifiOff,
  Zap,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Database,
  Server,
  Cloud,
  Minus,
  Equal,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Asterisk,
  Ampersand,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Users,
  Calendar,
  Mail,
  MessageCircle
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

const ContentManagementAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('templates') // templates, banners, pages, seo, media
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [showPageModal, setShowPageModal] = useState(false)

  const [contentStats, setContentStats] = useState({
    totalTemplates: 0,
    activeBanners: 0,
    totalPages: 0,
    mediaFiles: 0,
    seoScore: 0,
    pageViews: 0,
    bounceRate: 0,
    averageTimeOnPage: 0,
    lastUpdated: new Date()
  })

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Email de Boas-vindas',
      type: 'email',
      category: 'authentication',
      status: 'active',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      usage: 1250,
      description: 'Template para email de boas-vindas de novos usuários'
    },
    {
      id: 2,
      name: 'Confirmação de Agendamento',
      type: 'email',
      category: 'appointment',
      status: 'active',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      usage: 5600,
      description: 'Template para confirmação de agendamentos'
    },
    {
      id: 3,
      name: 'Página de Login',
      type: 'page',
      category: 'authentication',
      status: 'active',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      usage: 15420,
      description: 'Template para página de login'
    },
    {
      id: 4,
      name: 'Notificação de Lembrete',
      type: 'notification',
      category: 'appointment',
      status: 'draft',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      usage: 0,
      description: 'Template para lembretes de agendamento'
    }
  ])

  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Black Friday 2024',
      type: 'promotion',
      status: 'active',
      position: 'top',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      clicks: 1250,
      impressions: 15600,
      ctr: 8.0,
      image: '/images/banner-black-friday.jpg',
      link: '/promocoes/black-friday'
    },
    {
      id: 2,
      title: 'Novos Estabelecimentos',
      type: 'announcement',
      status: 'active',
      position: 'sidebar',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      clicks: 890,
      impressions: 12400,
      ctr: 7.2,
      image: '/images/banner-novos-estabelecimentos.jpg',
      link: '/estabelecimentos'
    },
    {
      id: 3,
      title: 'App Mobile Disponível',
      type: 'feature',
      status: 'scheduled',
      position: 'bottom',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      clicks: 0,
      impressions: 0,
      ctr: 0,
      image: '/images/banner-app-mobile.jpg',
      link: '/app'
    }
  ])

  const [pages, setPages] = useState([
    {
      id: 1,
      title: 'Página Inicial',
      slug: '/',
      status: 'published',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      views: 45680,
      seoScore: 95,
      metaTitle: 'JFAgende - Agendamento Online',
      metaDescription: 'Plataforma de agendamento online para estabelecimentos'
    },
    {
      id: 2,
      title: 'Sobre Nós',
      slug: '/sobre',
      status: 'published',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      views: 1250,
      seoScore: 88,
      metaTitle: 'Sobre o JFAgende',
      metaDescription: 'Conheça nossa história e missão'
    },
    {
      id: 3,
      title: 'Política de Privacidade',
      slug: '/privacidade',
      status: 'published',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      views: 890,
      seoScore: 92,
      metaTitle: 'Política de Privacidade - JFAgende',
      metaDescription: 'Como protegemos seus dados pessoais'
    },
    {
      id: 4,
      title: 'Termos de Uso',
      slug: '/termos',
      status: 'draft',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      views: 0,
      seoScore: 0,
      metaTitle: 'Termos de Uso - JFAgende',
      metaDescription: 'Termos e condições de uso da plataforma'
    }
  ])

  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      name: 'logo-jfagende.png',
      type: 'image',
      size: 245760,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      url: '/images/logo-jfagende.png',
      alt: 'Logo JFAgende',
      usage: 15
    },
    {
      id: 2,
      name: 'banner-hero.jpg',
      type: 'image',
      size: 1024000,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      url: '/images/banner-hero.jpg',
      alt: 'Banner principal',
      usage: 8
    },
    {
      id: 3,
      name: 'video-demo.mp4',
      type: 'video',
      size: 15728640,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      url: '/videos/demo.mp4',
      alt: 'Vídeo demonstrativo',
      usage: 3
    }
  ])

  const [seoData, setSeoData] = useState([
    { page: 'Página Inicial', score: 95, issues: 2, suggestions: 3 },
    { page: 'Sobre Nós', score: 88, issues: 5, suggestions: 7 },
    { page: 'Estabelecimentos', score: 92, issues: 3, suggestions: 4 },
    { page: 'Contato', score: 78, issues: 8, suggestions: 12 },
    { page: 'Blog', score: 85, issues: 6, suggestions: 9 }
  ])

  const templateTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'page', label: 'Página', icon: FileText },
    { value: 'notification', label: 'Notificação', icon: Bell },
    { value: 'sms', label: 'SMS', icon: MessageCircle }
  ]

  const bannerTypes = [
    { value: 'promotion', label: 'Promoção', color: 'red' },
    { value: 'announcement', label: 'Anúncio', color: 'blue' },
    { value: 'feature', label: 'Funcionalidade', color: 'green' },
    { value: 'warning', label: 'Aviso', color: 'yellow' }
  ]

  const bannerPositions = [
    { value: 'top', label: 'Topo' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'bottom', label: 'Rodapé' },
    { value: 'popup', label: 'Popup' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Ativo', color: 'green' },
    { value: 'inactive', label: 'Inativo', color: 'gray' },
    { value: 'draft', label: 'Rascunho', color: 'yellow' },
    { value: 'scheduled', label: 'Agendado', color: 'blue' },
    { value: 'archived', label: 'Arquivado', color: 'purple' }
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados de conteúdo
      const stats = {
        totalTemplates: 24,
        activeBanners: 3,
        totalPages: 12,
        mediaFiles: 156,
        seoScore: 89,
        pageViews: 125680,
        bounceRate: 32.5,
        averageTimeOnPage: 2.5,
        lastUpdated: new Date()
      }
      setContentStats(stats)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados de conteúdo' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return statusConfig ? statusConfig.color : 'gray'
  }

  const getBannerTypeColor = (type) => {
    const typeConfig = bannerTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.color : 'gray'
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'document': return FileText
      default: return FileText
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Lista de Templates */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Templates</h3>
          <Button
            onClick={() => setShowTemplateModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => {
            const TypeIcon = templateTypes.find(t => t.value === template.type)?.icon || FileText
            
            return (
              <div key={template.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="text-blue-600" size={20} />
                    <h4 className="font-semibold">{template.name}</h4>
                  </div>
                  <Badge color={getStatusColor(template.status)} size="sm">
                    {template.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Categoria:</span>
                    <span className="font-medium capitalize">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Usos:</span>
                    <span className="font-medium">{formatNumber(template.usage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Modificado:</span>
                    <span className="font-medium">{formatDate(template.lastModified)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit size={14} />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy size={14} />
                    Duplicar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )

  const renderBanners = () => (
    <div className="space-y-6">
      {/* Lista de Banners */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Banners</h3>
          <Button
            onClick={() => setShowBannerModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Banner
          </Button>
        </div>

        <div className="space-y-4">
          {banners.map(banner => (
            <div key={banner.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{banner.title}</h4>
                    <Badge color={getBannerTypeColor(banner.type)} size="sm">
                      {banner.type}
                    </Badge>
                    <Badge color={getStatusColor(banner.status)} size="sm">
                      {banner.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Posição: {banner.position} • {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Cliques</p>
                      <p className="font-medium">{formatNumber(banner.clicks)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Impressões</p>
                      <p className="font-medium">{formatNumber(banner.impressions)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">CTR</p>
                      <p className="font-medium">{banner.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Link</p>
                      <a href={banner.link} className="text-blue-600 hover:underline">
                        Ver página
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
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

  const renderPages = () => (
    <div className="space-y-6">
      {/* Lista de Páginas */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Páginas</h3>
          <Button
            onClick={() => setShowPageModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Nova Página
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Título</th>
                <th className="text-left py-3 px-4 font-medium">URL</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Visualizações</th>
                <th className="text-left py-3 px-4 font-medium">SEO Score</th>
                <th className="text-left py-3 px-4 font-medium">Última Modificação</th>
                <th className="text-left py-3 px-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{page.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {page.metaTitle}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {page.slug}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <Badge color={getStatusColor(page.status)} size="sm">
                      {page.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatNumber(page.views)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{page.seoScore}</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            page.seoScore >= 90 ? 'bg-green-600' :
                            page.seoScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${page.seoScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(page.lastModified)}
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
                        <ExternalLink size={16} />
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

  const renderSeo = () => (
    <div className="space-y-6">
      {/* Análise SEO */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Análise SEO</h3>
        <div className="space-y-4">
          {seoData.map((page, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{page.page}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{page.score}</span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        page.score >= 90 ? 'bg-green-600' :
                        page.score >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${page.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <XCircle className="text-red-500" size={16} />
                  <span>{page.issues} problemas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="text-blue-500" size={16} />
                  <span>{page.suggestions} sugestões</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Palavras-chave */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Palavras-chave Principais</h3>
        <div className="flex flex-wrap gap-2">
          {['agendamento online', 'estabelecimentos', 'reservas', 'agenda', 'horários', 'serviços'].map(keyword => (
            <Badge key={keyword} color="blue" size="sm">
              {keyword}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderMedia = () => (
    <div className="space-y-6">
      {/* Biblioteca de Mídia */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Biblioteca de Mídia</h3>
          <Button
            onClick={() => setShowTemplateModal(true)}
            size="sm"
          >
            <Upload size={16} />
            Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaFiles.map(file => {
            const FileIcon = getFileIcon(file.type)
            
            return (
              <div key={file.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <FileIcon className="text-gray-600 dark:text-gray-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                    <span className="font-medium capitalize">{file.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Usos:</span>
                    <span className="font-medium">{file.usage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Upload:</span>
                    <span className="font-medium">{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye size={14} />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download size={14} />
                    Baixar
                  </Button>
                </div>
              </div>
            )
          })}
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
              Gerenciamento de Conteúdo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie templates, banners, páginas, SEO e mídia
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
              onClick={() => setShowTemplateModal(true)}
              size="sm"
            >
              <Plus size={16} />
              Novo Conteúdo
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'banners', label: 'Banners', icon: ImageIcon },
            { id: 'pages', label: 'Páginas', icon: Globe },
            { id: 'seo', label: 'SEO', icon: Search },
            { id: 'media', label: 'Mídia', icon: Folder }
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
            {activeTab === 'templates' && renderTemplates()}
            {activeTab === 'banners' && renderBanners()}
            {activeTab === 'pages' && renderPages()}
            {activeTab === 'seo' && renderSeo()}
            {activeTab === 'media' && renderMedia()}
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

export default ContentManagementAdmin
