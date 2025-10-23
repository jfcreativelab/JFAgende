import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Coins, 
  Receipt, 
  Calculator, 
  Percent, 
  Target, 
  Activity, 
  RefreshCw, 
  Download, 
  Upload, 
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
  Settings, 
  Eye, 
  EyeOff, 
  File, 
  FileText, 
  Folder, 
  FolderOpen, 
  Cloud, 
  CloudOff, 
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
  Wifi, 
  WifiOff, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
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
import AdminMetricCard from '../components/AdminMetricCard'
import AdminChart from '../components/AdminChart'

const FinanceiroAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, revenue, expenses, commissions, reports
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showCommissionModal, setShowCommissionModal] = useState(false)

  const [financialStats, setFinancialStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    revenueGrowth: 0,
    profitMargin: 0,
    totalCommissions: 0,
    pendingPayments: 0,
    averageTransaction: 0,
    totalTransactions: 0
  })

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 15000, expenses: 8000, profit: 7000 },
    { month: 'Fev', revenue: 18000, expenses: 9000, profit: 9000 },
    { month: 'Mar', revenue: 22000, expenses: 10000, profit: 12000 },
    { month: 'Abr', revenue: 19000, expenses: 8500, profit: 10500 },
    { month: 'Mai', revenue: 25000, expenses: 11000, profit: 14000 },
    { month: 'Jun', revenue: 28000, expenses: 12000, profit: 16000 }
  ])

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'revenue',
      description: 'Assinatura Premium - Salão Beleza & Cia',
      amount: 299.90,
      status: 'completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      method: 'PIX',
      establishment: 'Salão Beleza & Cia',
      commission: 29.99
    },
    {
      id: 2,
      type: 'revenue',
      description: 'Assinatura Básica - Barbearia do João',
      amount: 99.90,
      status: 'completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 4),
      method: 'Cartão',
      establishment: 'Barbearia do João',
      commission: 9.99
    },
    {
      id: 3,
      type: 'expense',
      description: 'Taxa de processamento Stripe',
      amount: -15.50,
      status: 'completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 6),
      method: 'Automático',
      establishment: 'Sistema',
      commission: 0
    },
    {
      id: 4,
      type: 'revenue',
      description: 'Assinatura Premium - Clínica Estética',
      amount: 299.90,
      status: 'pending',
      date: new Date(Date.now() - 1000 * 60 * 60 * 8),
      method: 'PIX',
      establishment: 'Clínica Estética',
      commission: 29.99
    },
    {
      id: 5,
      type: 'revenue',
      description: 'Assinatura Básica - Academia Fit',
      amount: 99.90,
      status: 'completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 12),
      method: 'Cartão',
      establishment: 'Academia Fit',
      commission: 9.99
    }
  ])

  const [commissions, setCommissions] = useState([
    {
      id: 1,
      establishment: 'Salão Beleza & Cia',
      plan: 'Premium',
      monthlyFee: 299.90,
      commissionRate: 10,
      commissionAmount: 29.99,
      status: 'paid',
      paymentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      totalEarnings: 149.95
    },
    {
      id: 2,
      establishment: 'Barbearia do João',
      plan: 'Básico',
      monthlyFee: 99.90,
      commissionRate: 10,
      commissionAmount: 9.99,
      status: 'paid',
      paymentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      totalEarnings: 49.95
    },
    {
      id: 3,
      establishment: 'Clínica Estética',
      plan: 'Premium',
      monthlyFee: 299.90,
      commissionRate: 10,
      commissionAmount: 29.99,
      status: 'pending',
      paymentDate: null,
      totalEarnings: 89.97
    },
    {
      id: 4,
      establishment: 'Academia Fit',
      plan: 'Básico',
      monthlyFee: 99.90,
      commissionRate: 10,
      commissionAmount: 9.99,
      status: 'paid',
      paymentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      totalEarnings: 29.97
    }
  ])

  const periods = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'all', label: 'Todo o período' }
  ]

  const transactionTypes = [
    { value: 'all', label: 'Todas as transações' },
    { value: 'revenue', label: 'Receitas' },
    { value: 'expense', label: 'Despesas' },
    { value: 'commission', label: 'Comissões' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'completed', label: 'Concluído' },
    { value: 'pending', label: 'Pendente' },
    { value: 'failed', label: 'Falhou' },
    { value: 'cancelled', label: 'Cancelado' }
  ]

  useEffect(() => {
    carregarDados()
  }, [selectedPeriod])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados financeiros
      const stats = {
        totalRevenue: 125680.50,
        monthlyRevenue: 28500.30,
        totalExpenses: 15680.25,
        netProfit: 109000.25,
        revenueGrowth: 12.5,
        profitMargin: 86.7,
        totalCommissions: 12568.05,
        pendingPayments: 3599.70,
        averageTransaction: 199.80,
        totalTransactions: 628
      }
      setFinancialStats(stats)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados financeiros' })
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'revenue': return TrendingUp
      case 'expense': return TrendingDown
      case 'commission': return Percent
      default: return Activity
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'revenue': return 'green'
      case 'expense': return 'red'
      case 'commission': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green'
      case 'pending': return 'yellow'
      case 'failed': return 'red'
      case 'cancelled': return 'gray'
      default: return 'blue'
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Receita Total"
          value={financialStats.totalRevenue}
          icon={DollarSign}
          color="green"
          format="currency"
          change={financialStats.revenueGrowth}
          changeType="positive"
        />
        <AdminMetricCard
          title="Lucro Líquido"
          value={financialStats.netProfit}
          icon={TrendingUp}
          color="blue"
          format="currency"
          change={financialStats.profitMargin}
          changeType="positive"
          suffix="%"
        />
        <AdminMetricCard
          title="Comissões"
          value={financialStats.totalCommissions}
          icon={Percent}
          color="purple"
          format="currency"
        />
        <AdminMetricCard
          title="Pagamentos Pendentes"
          value={financialStats.pendingPayments}
          icon={Clock}
          color="yellow"
          format="currency"
        />
      </div>

      {/* Gráfico de Receita */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução da Receita</h3>
        <AdminChart
          type="line"
          data={revenueData}
          xKey="month"
          yKey="revenue"
          height={300}
          color="#10B981"
        />
      </Card>

      {/* Transações Recentes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(transaction => {
            const Icon = getTransactionIcon(transaction.type)
            const color = getTransactionColor(transaction.type)
            
            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                    <Icon className={`text-${color}-600 dark:text-${color}-400`} size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {transaction.establishment} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge color={getStatusColor(transaction.status)} size="sm">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )

  const renderRevenue = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              {transactionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm">
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} />
            <Input
              placeholder="Buscar transações..."
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

      {/* Lista de Transações */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Tipo</th>
                <th className="text-left py-3 px-4 font-medium">Descrição</th>
                <th className="text-left py-3 px-4 font-medium">Estabelecimento</th>
                <th className="text-left py-3 px-4 font-medium">Valor</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Data</th>
                <th className="text-left py-3 px-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => {
                const Icon = getTransactionIcon(transaction.type)
                const color = getTransactionColor(transaction.type)
                
                return (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`text-${color}-600`} size={16} />
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{transaction.description}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{transaction.establishment}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge color={getStatusColor(transaction.status)} size="sm">
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {formatDate(transaction.date)}
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
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const renderCommissions = () => (
    <div className="space-y-6">
      {/* Resumo de Comissões */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Percent className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pago</p>
              <p className="text-xl font-bold">{formatCurrency(commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0))}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendente</p>
              <p className="text-xl font-bold">{formatCurrency(commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0))}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Média</p>
              <p className="text-xl font-bold">10%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Comissões */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Comissões por Estabelecimento</h3>
        <div className="space-y-4">
          {commissions.map(commission => (
            <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {commission.establishment.split(' ').map(w => w[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{commission.establishment}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {commission.plan} • {formatCurrency(commission.monthlyFee)}/mês
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium">{formatCurrency(commission.commissionAmount)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {commission.commissionRate}% • Total: {formatCurrency(commission.totalEarnings)}
                </p>
                <Badge color={getStatusColor(commission.status)} size="sm">
                  {commission.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BarChart3 className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="font-semibold">Relatório de Receitas</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Análise detalhada de receitas por período, estabelecimento e tipo de plano.
          </p>
          <Button variant="outline" size="sm">
            <Download size={16} />
            Gerar PDF
          </Button>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <PieChart className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="font-semibold">Relatório de Comissões</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Distribuição de comissões por estabelecimento e período.
          </p>
          <Button variant="outline" size="sm">
            <Download size={16} />
            Gerar Excel
          </Button>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <LineChart className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="font-semibold">Relatório de Crescimento</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Análise de crescimento de receita e número de estabelecimentos.
          </p>
          <Button variant="outline" size="sm">
            <Download size={16} />
            Gerar CSV
          </Button>
        </Card>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Receita vs Despesas</h3>
          <AdminChart
            type="bar"
            data={revenueData}
            xKey="month"
            yKey="revenue"
            height={250}
            color="#10B981"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Planos</h3>
          <AdminChart
            type="pie"
            data={[
              { label: 'Básico', value: 45 },
              { label: 'Premium', value: 35 },
              { label: 'Enterprise', value: 20 }
            ]}
            labelKey="label"
            valueKey="value"
            height={250}
          />
        </Card>
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
              Centro Financeiro
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie receitas, despesas, comissões e relatórios financeiros
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
              onClick={() => setShowInvoiceModal(true)}
              size="sm"
            >
              <Receipt size={16} />
              Nova Fatura
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'revenue', label: 'Receitas', icon: TrendingUp },
            { id: 'commissions', label: 'Comissões', icon: Percent },
            { id: 'reports', label: 'Relatórios', icon: FileText }
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
            {activeTab === 'revenue' && renderRevenue()}
            {activeTab === 'commissions' && renderCommissions()}
            {activeTab === 'reports' && renderReports()}
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

export default FinanceiroAdmin
