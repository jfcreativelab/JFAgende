import { useState, useEffect } from 'react'
import { 
  Target,
  Users,
  Mail,
  MessageSquare,
  Megaphone,
  ImageIcon,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Share2,
  Heart,
  ThumbsUp,
  MessageCircle,
  Send,
  Plus,
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
  Tag,
  Percent,
  DollarSign,
  Smartphone,
  Monitor,
  Globe,
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
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  MoreVertical,
  Palette,
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
  Cloud
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

const MarketingAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('campaigns') // campaigns, email, social, analytics, templates
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const [marketingStats, setMarketingStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalEmails: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    totalRevenue: 0,
    socialFollowers: 0,
    socialEngagement: 0,
    websiteVisits: 0
  })

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Black Friday 2024',
      type: 'email',
      status: 'active',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      budget: 5000,
      spent: 3200,
      targetAudience: 'all_users',
      sent: 15000,
      opened: 4500,
      clicked: 900,
      converted: 180,
      revenue: 54000,
      description: 'Campanha de Black Friday com descontos especiais'
    },
    {
      id: 2,
      name: 'Novos Estabelecimentos',
      type: 'social',
      status: 'completed',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      budget: 2000,
      spent: 1950,
      targetAudience: 'new_establishments',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      description: 'Divulgação de novos estabelecimentos na plataforma'
    },
    {
      id: 3,
      name: 'Retenção de Clientes',
      type: 'email',
      status: 'scheduled',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      budget: 1500,
      spent: 0,
      targetAudience: 'inactive_users',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      description: 'Campanha para reativar clientes inativos'
    }
  ])

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Boas-vindas',
      subject: 'Bem-vindo ao JFAgende!',
      type: 'welcome',
      status: 'active',
      sent: 1250,
      openRate: 68.5,
      clickRate: 12.3,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    },
    {
      id: 2,
      name: 'Confirmação de Agendamento',
      subject: 'Seu agendamento foi confirmado',
      type: 'confirmation',
      status: 'active',
      sent: 5600,
      openRate: 85.2,
      clickRate: 45.8,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45)
    },
    {
      id: 3,
      name: 'Promoção Black Friday',
      subject: 'Ofertas imperdíveis na Black Friday!',
      type: 'promotion',
      status: 'active',
      sent: 15000,
      openRate: 72.1,
      clickRate: 18.7,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    }
  ])

  const [socialPosts, setSocialPosts] = useState([
    {
      id: 1,
      platform: 'instagram',
      content: 'Novos estabelecimentos incríveis disponíveis na plataforma! 🎉',
      image: '/images/social-post-1.jpg',
      status: 'published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 245,
      comments: 18,
      shares: 12,
      reach: 1250,
      engagement: 275
    },
    {
      id: 2,
      platform: 'facebook',
      content: 'Dicas para manter seus clientes satisfeitos e fiéis 💡',
      image: '/images/social-post-2.jpg',
      status: 'scheduled',
      publishedAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      engagement: 0
    },
    {
      id: 3,
      platform: 'linkedin',
      content: 'Como o agendamento online pode revolucionar seu negócio',
      image: null,
      status: 'draft',
      publishedAt: null,
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      engagement: 0
    }
  ])

  const [analyticsData, setAnalyticsData] = useState([
    { month: 'Jan', campaigns: 3, emails: 25000, opens: 17500, clicks: 3500, conversions: 700 },
    { month: 'Fev', campaigns: 4, emails: 30000, opens: 21000, clicks: 4200, conversions: 840 },
    { month: 'Mar', campaigns: 5, emails: 35000, opens: 24500, clicks: 4900, conversions: 980 },
    { month: 'Abr', campaigns: 6, emails: 40000, opens: 28000, clicks: 5600, conversions: 1120 },
    { month: 'Mai', campaigns: 7, emails: 45000, opens: 31500, clicks: 6300, conversions: 1260 },
    { month: 'Jun', campaigns: 8, emails: 50000, opens: 35000, clicks: 7000, conversions: 1400 }
  ])

  const campaignTypes = [
    { value: 'email', label: 'Email Marketing', icon: Mail },
    { value: 'social', label: 'Redes Sociais', icon: Share2 },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'push', label: 'Push Notification', icon: Bell },
    { value: 'banner', label: 'Banner', icon: ImageIcon }
  ]

  const campaignStatuses = [
    { value: 'draft', label: 'Rascunho', color: 'gray' },
    { value: 'scheduled', label: 'Agendada', color: 'blue' },
    { value: 'active', label: 'Ativa', color: 'green' },
    { value: 'paused', label: 'Pausada', color: 'yellow' },
    { value: 'completed', label: 'Concluída', color: 'purple' },
    { value: 'cancelled', label: 'Cancelada', color: 'red' }
  ]

  const targetAudiences = [
    { value: 'all_users', label: 'Todos os usuários' },
    { value: 'new_users', label: 'Novos usuários' },
    { value: 'active_users', label: 'Usuários ativos' },
    { value: 'inactive_users', label: 'Usuários inativos' },
    { value: 'premium_users', label: 'Usuários premium' },
    { value: 'establishments', label: 'Estabelecimentos' },
    { value: 'clients', label: 'Clientes' }
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados de marketing
      const stats = {
        totalCampaigns: 12,
        activeCampaigns: 3,
        totalEmails: 125000,
        openRate: 72.5,
        clickRate: 15.8,
        conversionRate: 3.2,
        totalRevenue: 125000,
        socialFollowers: 15420,
        socialEngagement: 8.7,
        websiteVisits: 45680
      }
      setMarketingStats(stats)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados de marketing' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = campaignStatuses.find(s => s.value === status)
    return statusConfig ? statusConfig.color : 'gray'
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return Camera
      case 'facebook': return Users
      case 'linkedin': return Briefcase
      case 'twitter': return MessageCircle
      default: return Share2
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Métricas de Campanhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Total de Campanhas"
          value={marketingStats.totalCampaigns}
          icon={Megaphone}
          color="blue"
          change={12.5}
          changeType="positive"
        />
        <AdminMetricCard
          title="Campanhas Ativas"
          value={marketingStats.activeCampaigns}
          icon={Play}
          color="green"
        />
        <AdminMetricCard
          title="Taxa de Abertura"
          value={marketingStats.openRate}
          icon={Eye}
          color="purple"
          suffix="%"
          change={2.3}
          changeType="positive"
        />
        <AdminMetricCard
          title="Taxa de Conversão"
          value={marketingStats.conversionRate}
          icon={Target}
          color="orange"
          suffix="%"
          change={0.8}
          changeType="positive"
        />
      </div>

      {/* Lista de Campanhas */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Campanhas</h3>
          <Button
            onClick={() => setShowCampaignModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Nova Campanha
          </Button>
        </div>

        <div className="space-y-4">
          {campaigns.map(campaign => {
            const TypeIcon = campaignTypes.find(t => t.value === campaign.type)?.icon || Megaphone
            const progress = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0
            
            return (
              <div key={campaign.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <TypeIcon className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <Badge color={getStatusColor(campaign.status)} size="sm">
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {campaign.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Orçamento</p>
                          <p className="font-medium">{formatCurrency(campaign.budget)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Gasto</p>
                          <p className="font-medium">{formatCurrency(campaign.spent)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Enviados</p>
                          <p className="font-medium">{formatNumber(campaign.sent)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Receita</p>
                          <p className="font-medium text-green-600">{formatCurrency(campaign.revenue)}</p>
                        </div>
                      </div>
                      {campaign.budget > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progresso do orçamento</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
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
            )
          })}
        </div>
      </Card>
    </div>
  )

  const renderEmail = () => (
    <div className="space-y-6">
      {/* Métricas de Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Mail className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Emails</p>
              <p className="text-xl font-bold">{formatNumber(marketingStats.totalEmails)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Abertura</p>
              <p className="text-xl font-bold">{marketingStats.openRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <MousePointer className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Clique</p>
              <p className="text-xl font-bold">{marketingStats.clickRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Templates de Email */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Templates de Email</h3>
          <Button
            onClick={() => setShowTemplateModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emailTemplates.map(template => (
            <div key={template.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{template.name}</h4>
                <Badge color={getStatusColor(template.status)} size="sm">
                  {template.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.subject}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Enviados:</span>
                  <span className="font-medium">{formatNumber(template.sent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Taxa de Abertura:</span>
                  <span className="font-medium text-green-600">{template.openRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Taxa de Clique:</span>
                  <span className="font-medium text-blue-600">{template.clickRate}%</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit size={14} />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye size={14} />
                  Visualizar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderSocial = () => (
    <div className="space-y-6">
      {/* Métricas Sociais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
              <Users className="text-pink-600 dark:text-pink-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Seguidores</p>
              <p className="text-xl font-bold">{formatNumber(marketingStats.socialFollowers)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Heart className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engajamento</p>
              <p className="text-xl font-bold">{marketingStats.socialEngagement}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Globe className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visitas</p>
              <p className="text-xl font-bold">{formatNumber(marketingStats.websiteVisits)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Posts Sociais */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Posts Sociais</h3>
          <Button
            onClick={() => setShowCampaignModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Post
          </Button>
        </div>

        <div className="space-y-4">
          {socialPosts.map(post => {
            const PlatformIcon = getPlatformIcon(post.platform)
            
            return (
              <div key={post.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <PlatformIcon className="text-gray-600 dark:text-gray-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold capitalize">{post.platform}</h4>
                      <Badge color={getStatusColor(post.status)} size="sm">
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="w-32 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={24} />
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Curtidas</p>
                        <p className="font-medium">{formatNumber(post.likes)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Comentários</p>
                        <p className="font-medium">{formatNumber(post.comments)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Compartilhamentos</p>
                        <p className="font-medium">{formatNumber(post.shares)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Alcance</p>
                        <p className="font-medium">{formatNumber(post.reach)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Engajamento</p>
                        <p className="font-medium">{formatNumber(post.engagement)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance de Campanhas</h3>
          <AdminChart
            type="line"
            data={analyticsData}
            xKey="month"
            yKey="campaigns"
            height={250}
            color="#3B82F6"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Emails Enviados</h3>
          <AdminChart
            type="bar"
            data={analyticsData}
            xKey="month"
            yKey="emails"
            height={250}
            color="#10B981"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Taxa de Abertura</h3>
          <AdminChart
            type="line"
            data={analyticsData.map(d => ({ month: d.month, rate: (d.opens / d.emails) * 100 }))}
            xKey="month"
            yKey="rate"
            height={250}
            color="#8B5CF6"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conversões</h3>
          <AdminChart
            type="bar"
            data={analyticsData}
            xKey="month"
            yKey="conversions"
            height={250}
            color="#F59E0B"
          />
        </Card>
      </div>

      {/* Relatórios Detalhados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Relatórios de Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="text-blue-600" size={24} />
              <h4 className="font-semibold">Relatório de Campanhas</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Análise detalhada de performance de todas as campanhas
            </p>
            <Button variant="outline" size="sm">
              <Download size={16} />
              Baixar PDF
            </Button>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="text-green-600" size={24} />
              <h4 className="font-semibold">Relatório de Email</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Métricas de email marketing e templates
            </p>
            <Button variant="outline" size="sm">
              <Download size={16} />
              Baixar Excel
            </Button>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Share2 className="text-purple-600" size={24} />
              <h4 className="font-semibold">Relatório Social</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Performance em redes sociais e engajamento
            </p>
            <Button variant="outline" size="sm">
              <Download size={16} />
              Baixar CSV
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
              Centro de Marketing
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie campanhas, emails, redes sociais e analytics de marketing
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
              onClick={() => setShowCampaignModal(true)}
              size="sm"
            >
              <Plus size={16} />
              Nova Campanha
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'campaigns', label: 'Campanhas', icon: Megaphone },
            { id: 'email', label: 'Email Marketing', icon: Mail },
            { id: 'social', label: 'Redes Sociais', icon: Share2 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
            {activeTab === 'campaigns' && renderCampaigns()}
            {activeTab === 'email' && renderEmail()}
            {activeTab === 'social' && renderSocial()}
            {activeTab === 'analytics' && renderAnalytics()}
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

export default MarketingAdmin
