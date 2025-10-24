import { useState, useEffect } from 'react'
import { 
  Headphones,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Mail,
  Phone,
  Users,
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
  Camera,
  Mic,
  Volume2,
  VolumeX,
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
  Plus,
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
  Calendar,
  Bell,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Upload,
  Settings,
  Eye,
  EyeOff
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

const SupportAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('tickets') // tickets, chat, faq, knowledge
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false)

  const [supportStats, setSupportStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    averageResponseTime: 0,
    customerSatisfaction: 0,
    activeChats: 0,
    totalFaqs: 0,
    knowledgeArticles: 0,
    lastUpdated: new Date()
  })

  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Problema com login no aplicativo',
      description: 'Não consigo fazer login no aplicativo mobile',
      status: 'open',
      priority: 'high',
      category: 'technical',
      customer: {
        id: 'user_123',
        name: 'João Silva',
        email: 'joao@email.com',
        type: 'cliente'
      },
      assignedTo: {
        id: 'admin_456',
        name: 'Maria Santos'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      lastUpdate: new Date(Date.now() - 1000 * 60 * 30),
      messages: 3
    },
    {
      id: 2,
      title: 'Dúvida sobre cobrança',
      description: 'Gostaria de entender como funciona a cobrança da plataforma',
      status: 'in_progress',
      priority: 'medium',
      category: 'billing',
      customer: {
        id: 'est_789',
        name: 'Salão Beleza & Cia',
        email: 'contato@salao.com',
        type: 'estabelecimento'
      },
      assignedTo: {
        id: 'admin_789',
        name: 'Carlos Oliveira'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 4),
      messages: 5
    },
    {
      id: 3,
      title: 'Solicitação de nova funcionalidade',
      description: 'Gostaria de sugerir uma nova funcionalidade para a plataforma',
      status: 'resolved',
      priority: 'low',
      category: 'feature_request',
      customer: {
        id: 'user_456',
        name: 'Ana Costa',
        email: 'ana@email.com',
        type: 'cliente'
      },
      assignedTo: {
        id: 'admin_456',
        name: 'Maria Santos'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      messages: 8
    }
  ])

  const [chats, setChats] = useState([
    {
      id: 1,
      customer: {
        id: 'user_789',
        name: 'Pedro Santos',
        email: 'pedro@email.com',
        type: 'cliente'
      },
      agent: {
        id: 'admin_123',
        name: 'Sofia Lima'
      },
      status: 'active',
      startedAt: new Date(Date.now() - 1000 * 60 * 30),
      lastMessage: new Date(Date.now() - 1000 * 60 * 5),
      messages: 12
    },
    {
      id: 2,
      customer: {
        id: 'est_456',
        name: 'Barbearia do João',
        email: 'joao@barbearia.com',
        type: 'estabelecimento'
      },
      agent: {
        id: 'admin_456',
        name: 'Maria Santos'
      },
      status: 'waiting',
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      lastMessage: new Date(Date.now() - 1000 * 60 * 15),
      messages: 6
    }
  ])

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'Como faço para agendar um serviço?',
      answer: 'Para agendar um serviço, acesse a plataforma, escolha o estabelecimento desejado, selecione o serviço e o horário disponível.',
      category: 'agendamento',
      status: 'published',
      views: 1250,
      helpful: 89,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    },
    {
      id: 2,
      question: 'Como cancelar um agendamento?',
      answer: 'Você pode cancelar um agendamento através do seu perfil, na seção "Meus Agendamentos", clicando em "Cancelar".',
      category: 'agendamento',
      status: 'published',
      views: 890,
      helpful: 76,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25)
    },
    {
      id: 3,
      question: 'Como funciona o pagamento antecipado?',
      answer: 'O pagamento antecipado permite que você pague pelo serviço antes do agendamento através de PIX ou cartão.',
      category: 'pagamento',
      status: 'published',
      views: 650,
      helpful: 82,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)
    }
  ])

  const [knowledgeBase, setKnowledgeBase] = useState([
    {
      id: 1,
      title: 'Guia de Uso da Plataforma',
      content: 'Este guia explica como usar todas as funcionalidades da plataforma...',
      category: 'user_guide',
      status: 'published',
      views: 2500,
      helpful: 95,
      tags: ['guia', 'tutorial', 'início'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
    },
    {
      id: 2,
      title: 'Configuração de Estabelecimento',
      content: 'Aprenda como configurar seu estabelecimento na plataforma...',
      category: 'setup',
      status: 'published',
      views: 1800,
      helpful: 88,
      tags: ['configuração', 'estabelecimento', 'setup'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45)
    },
    {
      id: 3,
      title: 'Solução de Problemas Comuns',
      content: 'Lista dos problemas mais comuns e suas soluções...',
      category: 'troubleshooting',
      status: 'draft',
      views: 0,
      helpful: 0,
      tags: ['problemas', 'solução', 'troubleshooting'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    }
  ])

  const [ticketStats, setTicketStats] = useState([
    { day: 'Seg', tickets: 12, resolved: 8 },
    { day: 'Ter', tickets: 15, resolved: 12 },
    { day: 'Qua', tickets: 18, resolved: 14 },
    { day: 'Qui', tickets: 22, resolved: 18 },
    { day: 'Sex', tickets: 16, resolved: 13 },
    { day: 'Sáb', tickets: 8, resolved: 6 },
    { day: 'Dom', tickets: 5, resolved: 4 }
  ])

  const ticketStatuses = [
    { value: 'open', label: 'Aberto', color: 'red' },
    { value: 'in_progress', label: 'Em Andamento', color: 'yellow' },
    { value: 'resolved', label: 'Resolvido', color: 'green' },
    { value: 'closed', label: 'Fechado', color: 'gray' }
  ]

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'green' },
    { value: 'medium', label: 'Média', color: 'yellow' },
    { value: 'high', label: 'Alta', color: 'red' },
    { value: 'urgent', label: 'Urgente', color: 'purple' }
  ]

  const categories = [
    { value: 'technical', label: 'Técnico' },
    { value: 'billing', label: 'Cobrança' },
    { value: 'feature_request', label: 'Solicitação' },
    { value: 'bug_report', label: 'Bug' },
    { value: 'general', label: 'Geral' }
  ]

  const chatStatuses = [
    { value: 'active', label: 'Ativo', color: 'green' },
    { value: 'waiting', label: 'Aguardando', color: 'yellow' },
    { value: 'ended', label: 'Finalizado', color: 'gray' }
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Simular dados de suporte
      const stats = {
        totalTickets: 156,
        openTickets: 23,
        resolvedTickets: 128,
        averageResponseTime: 2.5,
        customerSatisfaction: 4.6,
        activeChats: 5,
        totalFaqs: 45,
        knowledgeArticles: 28,
        lastUpdated: new Date()
      }
      setSupportStats(stats)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados de suporte' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = ticketStatuses.find(s => s.value === status)
    return statusConfig ? statusConfig.color : 'gray'
  }

  const getPriorityColor = (priority) => {
    const priorityConfig = priorities.find(p => p.value === priority)
    return priorityConfig ? priorityConfig.color : 'gray'
  }

  const getChatStatusColor = (status) => {
    const statusConfig = chatStatuses.find(s => s.value === status)
    return statusConfig ? statusConfig.color : 'gray'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const renderTickets = () => (
    <div className="space-y-6">
      {/* Métricas de Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Total de Tickets"
          value={supportStats.totalTickets}
          icon={MessageCircle}
          color="blue"
          format="number"
          change={8.5}
          changeType="positive"
        />
        <AdminMetricCard
          title="Tickets Abertos"
          value={supportStats.openTickets}
          icon={AlertCircle}
          color="red"
          format="number"
        />
        <AdminMetricCard
          title="Tempo Médio de Resposta"
          value={supportStats.averageResponseTime}
          icon={Clock}
          color="purple"
          format="number"
          suffix="h"
          change={-0.5}
          changeType="positive"
        />
        <AdminMetricCard
          title="Satisfação do Cliente"
          value={supportStats.customerSatisfaction}
          icon={Star}
          color="green"
          format="number"
          suffix="/5"
          change={0.2}
          changeType="positive"
        />
      </div>

      {/* Lista de Tickets */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Tickets de Suporte</h3>
          <Button
            onClick={() => setShowTicketModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Ticket
          </Button>
        </div>

        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{ticket.title}</h4>
                    <Badge color={getStatusColor(ticket.status)} size="sm">
                      {ticket.status}
                    </Badge>
                    <Badge color={getPriorityColor(ticket.priority)} size="sm">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {ticket.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Cliente</p>
                      <p className="font-medium">{ticket.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Atribuído a</p>
                      <p className="font-medium">{ticket.assignedTo.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Criado em</p>
                      <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Mensagens</p>
                      <p className="font-medium">{ticket.messages}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle size={16} />
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

  const renderChat = () => (
    <div className="space-y-6">
      {/* Chat Ativo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chats Ativos</h3>
        <div className="space-y-4">
          {chats.map(chat => (
            <div key={chat.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {chat.customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{chat.customer.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {chat.customer.email} • {chat.customer.type}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge color={getChatStatusColor(chat.status)} size="sm">
                    {chat.status}
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatNumber(chat.messages)} mensagens
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Última: {formatDate(chat.lastMessage)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderFaq = () => (
    <div className="space-y-6">
      {/* Lista de FAQs */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Perguntas Frequentes</h3>
          <Button
            onClick={() => setShowFaqModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Nova FAQ
          </Button>
        </div>

        <div className="space-y-4">
          {faqs.map(faq => (
            <div key={faq.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {faq.answer}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{formatNumber(faq.views)} visualizações</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      <span>{faq.helpful} úteis</span>
                    </div>
                    <Badge color="blue" size="sm">
                      {faq.category}
                    </Badge>
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

  const renderKnowledge = () => (
    <div className="space-y-6">
      {/* Base de Conhecimento */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Base de Conhecimento</h3>
          <Button
            onClick={() => setShowKnowledgeModal(true)}
            size="sm"
          >
            <Plus size={16} />
            Novo Artigo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeBase.map(article => (
            <div key={article.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{article.title}</h4>
                <Badge color={getStatusColor(article.status)} size="sm">
                  {article.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {article.content.substring(0, 100)}...
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Visualizações:</span>
                  <span className="font-medium">{formatNumber(article.views)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Úteis:</span>
                  <span className="font-medium">{article.helpful}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Categoria:</span>
                  <span className="font-medium capitalize">{article.category}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {article.tags.map(tag => (
                  <Badge key={tag} color="gray" size="sm">
                    {tag}
                  </Badge>
                ))}
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

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sistema de Suporte
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie tickets, chat, FAQ e base de conhecimento
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
              onClick={() => setShowTicketModal(true)}
              size="sm"
            >
              <Plus size={16} />
              Novo Ticket
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'tickets', label: 'Tickets', icon: MessageCircle },
            { id: 'chat', label: 'Chat', icon: Headphones },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen }
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
            {activeTab === 'tickets' && renderTickets()}
            {activeTab === 'chat' && renderChat()}
            {activeTab === 'faq' && renderFaq()}
            {activeTab === 'knowledge' && renderKnowledge()}
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

export default SupportAdmin
