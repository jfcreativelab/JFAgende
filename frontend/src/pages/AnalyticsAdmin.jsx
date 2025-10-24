import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Store, 
  Calendar, 
  DollarSign, 
  Activity, 
  Eye, 
  Clock, 
  Target, 
  Zap, 
  RefreshCw,
  Download,
  Filter,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  BarChart,
  AreaChart,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Star,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
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
  Search,
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
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  Mail,
  Phone,
  Camera,
  Image as ImageIcon,
  FileText,
  File,
  Folder,
  Archive,
  Tag,
  Flag,
  Bookmark,
  Star as StarIcon,
  Award,
  Crown,
  Gem,
  Sparkles,
  Rocket,
  Plane,
  Car,
  Home,
  Building,
  Building2,
  Factory,
  Store as StoreIcon,
  ShoppingCart,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  Percent,
  Hash,
  AtSign,
  Hash as HashIcon,
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
import AdminMetricCard from '../components/AdminMetricCard'
import AdminChart from '../components/AdminChart'
import AnimatedNumber from '../components/AnimatedNumber'

const AnalyticsAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [viewMode, setViewMode] = useState('overview') // overview, detailed, realtime
  const [selectedMetrics, setSelectedMetrics] = useState(['users', 'revenue', 'conversion'])
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalRevenue: 0,
      conversionRate: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      pageViews: 0,
      uniqueVisitors: 0,
      returningVisitors: 0
    },
    realtime: {
      activeUsers: 0,
      currentSessions: 0,
      pageViewsLastHour: 0,
      topPages: [],
      topCountries: [],
      topDevices: []
    },
    trends: {
      userGrowth: [],
      revenueGrowth: [],
      conversionTrends: [],
      trafficSources: [],
      deviceBreakdown: [],
      geographicData: []
    },
    insights: {
      topPerformingPages: [],
      userBehavior: [],
      conversionFunnels: [],
      recommendations: []
    }
  })

  const timeRanges = [
    { value: '1h', label: 'Última Hora' },
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ]

  const viewModes = [
    { value: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { value: 'detailed', label: 'Detalhado', icon: Activity },
    { value: 'realtime', label: 'Tempo Real', icon: Zap }
  ]

  const metrics = [
    { id: 'users', label: 'Usuários', icon: Users, color: 'blue' },
    { id: 'revenue', label: 'Receita', icon: DollarSign, color: 'green' },
    { id: 'conversion', label: 'Conversão', icon: Target, color: 'purple' },
    { id: 'engagement', label: 'Engajamento', icon: Heart, color: 'red' },
    { id: 'traffic', label: 'Tráfego', icon: Globe, color: 'yellow' },
    { id: 'performance', label: 'Performance', icon: Zap, color: 'indigo' }
  ]

  useEffect(() => {
    carregarAnalytics()
  }, [timeRange])

  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        carregarAnalytics()
      }, refreshInterval * 1000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const carregarAnalytics = async () => {
    setLoading(true)
    try {
      // Simular dados de analytics (em produção, buscar da API)
      const dadosSimulados = {
        overview: {
          totalUsers: 15420,
          totalRevenue: 125680.50,
          conversionRate: 3.2,
          avgSessionDuration: 4.5,
          bounceRate: 42.1,
          pageViews: 89450,
          uniqueVisitors: 12340,
          returningVisitors: 3080
        },
        realtime: {
          activeUsers: 47,
          currentSessions: 23,
          pageViewsLastHour: 156,
          topPages: [
            { page: '/', views: 45, percentage: 28.8 },
            { page: '/estabelecimentos', views: 32, percentage: 20.5 },
            { page: '/login', views: 28, percentage: 17.9 },
            { page: '/cadastro', views: 25, percentage: 16.0 },
            { page: '/sobre', views: 26, percentage: 16.7 }
          ],
          topCountries: [
            { country: 'Brasil', users: 35, percentage: 74.5 },
            { country: 'Estados Unidos', users: 8, percentage: 17.0 },
            { country: 'Portugal', users: 4, percentage: 8.5 }
          ],
          topDevices: [
            { device: 'Mobile', users: 32, percentage: 68.1 },
            { device: 'Desktop', users: 12, percentage: 25.5 },
            { device: 'Tablet', users: 3, percentage: 6.4 }
          ]
        },
        trends: {
          userGrowth: [
            { date: '2024-01-01', users: 1200, revenue: 8500 },
            { date: '2024-01-02', users: 1350, revenue: 9200 },
            { date: '2024-01-03', users: 1420, revenue: 9800 },
            { date: '2024-01-04', users: 1380, revenue: 9500 },
            { date: '2024-01-05', users: 1560, revenue: 11200 },
            { date: '2024-01-06', users: 1680, revenue: 12500 },
            { date: '2024-01-07', users: 1720, revenue: 13200 }
          ],
          revenueGrowth: [
            { date: '2024-01-01', revenue: 8500, growth: 5.2 },
            { date: '2024-01-02', revenue: 9200, growth: 8.2 },
            { date: '2024-01-03', revenue: 9800, growth: 6.5 },
            { date: '2024-01-04', revenue: 9500, growth: -3.1 },
            { date: '2024-01-05', revenue: 11200, growth: 17.9 },
            { date: '2024-01-06', revenue: 12500, growth: 11.6 },
            { date: '2024-01-07', revenue: 13200, growth: 5.6 }
          ],
          conversionTrends: [
            { source: 'Google', conversions: 45, rate: 3.2 },
            { source: 'Facebook', conversions: 32, rate: 2.8 },
            { source: 'Instagram', conversions: 28, rate: 2.5 },
            { source: 'Direto', conversions: 25, rate: 4.1 },
            { source: 'Email', conversions: 18, rate: 5.2 }
          ],
          trafficSources: [
            { source: 'Organic Search', percentage: 45.2, users: 5560 },
            { source: 'Social Media', percentage: 28.7, users: 3530 },
            { source: 'Direct', percentage: 15.8, users: 1940 },
            { source: 'Referral', percentage: 7.3, users: 900 },
            { source: 'Email', percentage: 3.0, users: 370 }
          ],
          deviceBreakdown: [
            { device: 'Mobile', percentage: 68.1, users: 10500 },
            { device: 'Desktop', percentage: 25.5, users: 3930 },
            { device: 'Tablet', percentage: 6.4, users: 990 }
          ],
          geographicData: [
            { country: 'Brasil', users: 12340, percentage: 80.1 },
            { country: 'Estados Unidos', users: 1850, percentage: 12.0 },
            { country: 'Portugal', users: 890, percentage: 5.8 },
            { country: 'Outros', users: 340, percentage: 2.1 }
          ]
        },
        insights: {
          topPerformingPages: [
            { page: '/', views: 12540, conversion: 3.2, revenue: 15680 },
            { page: '/estabelecimentos', views: 8940, conversion: 2.8, revenue: 11200 },
            { page: '/login', views: 4560, conversion: 4.1, revenue: 6800 },
            { page: '/cadastro', views: 3240, conversion: 5.2, revenue: 4200 },
            { page: '/sobre', views: 2180, conversion: 1.8, revenue: 1200 }
          ],
          userBehavior: [
            { action: 'Página Inicial', users: 12540, percentage: 100 },
            { action: 'Busca Estabelecimentos', users: 8940, percentage: 71.3 },
            { action: 'Visualiza Detalhes', users: 4560, percentage: 36.4 },
            { action: 'Faz Login', users: 3240, percentage: 25.8 },
            { action: 'Cria Conta', users: 2180, percentage: 17.4 },
            { action: 'Faz Agendamento', users: 1560, percentage: 12.4 }
          ],
          conversionFunnels: [
            { stage: 'Visitantes', count: 15420, percentage: 100 },
            { stage: 'Interessados', count: 8940, percentage: 58.0 },
            { stage: 'Considerando', count: 4560, percentage: 29.6 },
            { stage: 'Decidindo', count: 3240, percentage: 21.0 },
            { stage: 'Convertendo', count: 1560, percentage: 10.1 }
          ],
          recommendations: [
            {
              type: 'optimization',
              title: 'Otimizar Página de Estabelecimentos',
              description: 'A taxa de conversão está 15% abaixo da média. Considere melhorar o design e adicionar mais informações.',
              impact: 'high',
              effort: 'medium'
            },
            {
              type: 'content',
              title: 'Adicionar Depoimentos de Clientes',
              description: 'Páginas com depoimentos convertem 23% melhor. Adicione seção de avaliações na página inicial.',
              impact: 'medium',
              effort: 'low'
            },
            {
              type: 'technical',
              title: 'Melhorar Velocidade de Carregamento',
              description: 'Páginas que carregam em menos de 2s convertem 40% melhor. Otimize imagens e scripts.',
              impact: 'high',
              effort: 'high'
            }
          ]
        }
      }

      setAnalytics(dadosSimulados)
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados de analytics' })
    } finally {
      setLoading(false)
    }
  }

  const exportAnalytics = (format) => {
    // Implementar exportação de dados
    console.log(`Exportando analytics em formato ${format}`)
    setToast({ type: 'success', message: `Analytics exportado em formato ${format.toUpperCase()}` })
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total de Usuários"
          value={analytics.overview.totalUsers}
          change={12.5}
          changeType="positive"
          icon={Users}
          color="blue"
          format="number"
        />
        <AdminMetricCard
          title="Receita Total"
          value={analytics.overview.totalRevenue}
          change={8.3}
          changeType="positive"
          icon={DollarSign}
          color="green"
          format="currency"
        />
        <AdminMetricCard
          title="Taxa de Conversão"
          value={analytics.overview.conversionRate}
          change={-2.1}
          changeType="negative"
          icon={Target}
          color="purple"
          format="percentage"
        />
        <AdminMetricCard
          title="Tempo de Sessão"
          value={analytics.overview.avgSessionDuration}
          change={5.7}
          changeType="positive"
          icon={Clock}
          color="yellow"
          format="time"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Crescimento de Usuários</h3>
          <AdminChart
            type="line"
            data={analytics.trends.userGrowth}
            xKey="date"
            yKey="users"
            height={300}
            color="#3B82F6"
          />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Fontes de Tráfego</h3>
          <AdminChart
            type="pie"
            data={analytics.trends.trafficSources}
            labelKey="source"
            valueKey="percentage"
            height={300}
          />
        </Card>
      </div>

      {/* Insights e Recomendações */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Insights e Recomendações</h3>
        <div className="space-y-4">
          {analytics.insights.recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  rec.impact === 'high' ? 'bg-red-100 text-red-600' :
                  rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      rec.impact === 'high' ? 'bg-red-100 text-red-700' :
                      rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Impacto: {rec.impact}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      rec.effort === 'high' ? 'bg-red-100 text-red-700' :
                      rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Esforço: {rec.effort}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderDetailed = () => (
    <div className="space-y-6">
      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminMetricCard
          title="Páginas Visualizadas"
          value={analytics.overview.pageViews}
          change={15.2}
          changeType="positive"
          icon={Eye}
          color="blue"
          format="number"
        />
        <AdminMetricCard
          title="Visitantes Únicos"
          value={analytics.overview.uniqueVisitors}
          change={8.7}
          changeType="positive"
          icon={Users}
          color="green"
          format="number"
        />
        <AdminMetricCard
          title="Taxa de Rejeição"
          value={analytics.overview.bounceRate}
          change={-3.2}
          changeType="positive"
          icon={TrendingDown}
          color="red"
          format="percentage"
        />
      </div>

      {/* Análise de Comportamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Funil de Conversão</h3>
          <div className="space-y-3">
            {analytics.insights.conversionFunnels.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{stage.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stage.count.toLocaleString()}
                  </span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stage.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Páginas Mais Visitadas</h3>
          <div className="space-y-3">
            {analytics.insights.topPerformingPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="font-medium">{page.page}</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {page.views.toLocaleString()} visualizações
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{page.conversion}% conversão</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    R$ {page.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Análise Geográfica e Dispositivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Distribuição Geográfica</h3>
          <AdminChart
            type="bar"
            data={analytics.trends.geographicData}
            xKey="country"
            yKey="users"
            height={250}
            color="#10B981"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dispositivos</h3>
          <AdminChart
            type="doughnut"
            data={analytics.trends.deviceBreakdown}
            labelKey="device"
            valueKey="percentage"
            height={250}
          />
        </Card>
      </div>
    </div>
  )

  const renderRealtime = () => (
    <div className="space-y-6">
      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminMetricCard
          title="Usuários Ativos"
          value={analytics.realtime.activeUsers}
          icon={Users}
          color="green"
          format="number"
          realtime
        />
        <AdminMetricCard
          title="Sessões Ativas"
          value={analytics.realtime.currentSessions}
          icon={Activity}
          color="blue"
          format="number"
          realtime
        />
        <AdminMetricCard
          title="Visualizações (1h)"
          value={analytics.realtime.pageViewsLastHour}
          icon={Eye}
          color="purple"
          format="number"
          realtime
        />
      </div>

      {/* Páginas em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Páginas Mais Visitadas Agora</h3>
          <div className="space-y-3">
            {analytics.realtime.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{page.page}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {page.views} views
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Países (Agora)</h3>
          <div className="space-y-3">
            {analytics.realtime.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{country.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {country.users} usuários
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dispositivos (Agora)</h3>
          <div className="space-y-3">
            {analytics.realtime.topDevices.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{device.device}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {device.users} usuários
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 p-6 space-y-8">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                📊 ANALYTICS ULTRA PREMIUM
              </h1>
              <p className="text-purple-100 text-lg font-medium">
                ✨ Análise detalhada de performance e comportamento dos usuários
              </p>
            </div>
          
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  autoRefresh 
                    ? 'bg-white text-purple-600 shadow-lg hover:shadow-xl' 
                    : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
                }`}
              >
                <RefreshCw size={20} className={autoRefresh ? 'animate-spin' : ''} />
                <span className="ml-2">🔄 Auto Refresh</span>
              </Button>
              <Button
                onClick={() => exportAnalytics('pdf')}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/30"
              >
                <Download size={20} />
                <span className="ml-2">📥 Exportar</span>
              </Button>
            </div>
        </div>

        {/* Filtros Premium */}
        <Card className="p-6 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900 dark:to-pink-900 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">📅 Período:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-slate-800 text-sm font-medium shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              <span className="text-sm font-medium">Métricas:</span>
              <div className="flex gap-1">
                {metrics.map(metric => (
                  <Button
                    key={metric.id}
                    onClick={() => {
                      if (selectedMetrics.includes(metric.id)) {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id))
                      } else {
                        setSelectedMetrics([...selectedMetrics, metric.id])
                      }
                    }}
                    variant={selectedMetrics.includes(metric.id) ? "default" : "outline"}
                    size="sm"
                  >
                    <metric.icon size={16} />
                    {metric.label}
                  </Button>
                ))}
              </div>
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
            {viewMode === 'realtime' && renderRealtime()}
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

export default AnalyticsAdmin
