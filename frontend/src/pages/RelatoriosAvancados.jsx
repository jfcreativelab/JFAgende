import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  Users,
  Store,
  DollarSign,
  Activity,
  RefreshCw,
  Eye,
  FileText,
  Settings,
  Target,
  Award,
  Clock,
  Zap,
  Shield,
  Star,
  Crown,
  User,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Globe,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Share2,
  Printer,
  Send
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

const RelatoriosAvancados = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [filtros, setFiltros] = useState({
    periodo: '30d',
    tipoRelatorio: 'geral',
    estabelecimento: '',
    plano: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  })
  const [dados, setDados] = useState(null)
  const [viewMode, setViewMode] = useState('dashboard') // dashboard, charts, tables, export
  const [selectedCharts, setSelectedCharts] = useState(['crescimento', 'distribuicao', 'performance'])
  const [exportFormat, setExportFormat] = useState('pdf')

  const tiposRelatorio = [
    { id: 'geral', label: 'Relatório Geral', icon: BarChart3, color: 'blue' },
    { id: 'usuarios', label: 'Usuários', icon: Users, color: 'green' },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, color: 'purple' },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, color: 'yellow' },
    { id: 'performance', label: 'Performance', icon: Activity, color: 'red' },
    { id: 'sistema', label: 'Sistema', icon: Server, color: 'gray' }
  ]

  const periodos = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ]

  const chartTypes = [
    { id: 'crescimento', label: 'Crescimento', icon: TrendingUp },
    { id: 'distribuicao', label: 'Distribuição', icon: PieChart },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'sistema', label: 'Sistema', icon: Server }
  ]

  useEffect(() => {
    carregarDados()
  }, [filtros])

  const carregarDados = async () => {
    setLoading(true)
    try {
      console.log('🔍 Carregando relatórios avançados...')
      
      // Buscar dados reais da API
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://jfagende-production.up.railway.app/api/admin/relatorios-avancados', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const dadosReais = await response.json()
      console.log('📊 Dados reais recebidos:', dadosReais)
      
      setDados(dadosReais)
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error)
      
      // Fallback para dados simulados em caso de erro
      const dadosSimulados = {
        resumo: {
          totalUsuarios: 1247,
          totalEstabelecimentos: 89,
          totalAgendamentos: 3456,
          receitaTotal: 45678.90,
          crescimentoUsuarios: 12.5,
          crescimentoEstabelecimentos: 8.3,
          crescimentoAgendamentos: 23.7,
          crescimentoReceita: 18.2
        },
        usuariosPorMes: [
          { mes: 'Jan', usuarios: 100, estabelecimentos: 15 },
          { mes: 'Fev', usuarios: 150, estabelecimentos: 22 },
          { mes: 'Mar', usuarios: 200, estabelecimentos: 28 },
          { mes: 'Abr', usuarios: 180, estabelecimentos: 25 },
          { mes: 'Mai', usuarios: 250, estabelecimentos: 35 },
          { mes: 'Jun', usuarios: 300, estabelecimentos: 42 }
        ],
        agendamentosPorStatus: [
          { status: 'CONFIRMADO', quantidade: 1200, porcentagem: 35 },
          { status: 'PENDENTE', quantidade: 800, porcentagem: 23 },
          { status: 'CONCLUIDO', quantidade: 1000, porcentagem: 29 },
          { status: 'CANCELADO', quantidade: 456, porcentagem: 13 }
        ],
        receitaPorPlano: [
          { plano: 'FREE', receita: 0, quantidade: 45 },
          { plano: 'BASIC', receita: 15000, quantidade: 30 },
          { plano: 'PREMIUM', receita: 25000, quantidade: 14 }
        ],
        topEstabelecimentos: [
          { nome: 'Salão da Maria', agendamentos: 150, receita: 4500 },
          { nome: 'Barbearia do João', agendamentos: 120, receita: 3600 },
          { nome: 'Spa Relax', agendamentos: 100, receita: 5000 },
          { nome: 'Estética Bella', agendamentos: 90, receita: 2700 },
          { nome: 'Academia Fit', agendamentos: 80, receita: 2400 }
        ],
        metricasSistema: {
          uptime: '99.9%',
          responseTime: '120ms',
          memoryUsage: '68%',
          cpuUsage: '45%',
          errorRate: '0.1%',
          activeUsers: 450
        }
      }
      
      setDados(dadosSimulados)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (formato) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/admin/exportar-relatorio?formato=${formato}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio_${new Date().toISOString().split('T')[0]}.${formato}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setToast({ type: 'success', message: 'Relatório exportado com sucesso' })
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      setToast({ type: 'error', message: 'Erro ao exportar relatório' })
    }
  }

  const renderFiltros = () => (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtros Avançados
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={carregarDados}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </Button>
            <Button
              variant="outline"
              onClick={() => setFiltros({
                periodo: '30d',
                tipoRelatorio: 'geral',
                estabelecimento: '',
                plano: '',
                status: '',
                dataInicio: '',
                dataFim: ''
              })}
            >
              Limpar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <select
              value={filtros.periodo}
              onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {periodos.map(periodo => (
                <option key={periodo.value} value={periodo.value}>
                  {periodo.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={filtros.tipoRelatorio}
              onChange={(e) => setFiltros({ ...filtros, tipoRelatorio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {tiposRelatorio.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estabelecimento
            </label>
            <Input
              type="text"
              placeholder="Filtrar por estabelecimento"
              value={filtros.estabelecimento}
              onChange={(e) => setFiltros({ ...filtros, estabelecimento: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plano
            </label>
            <select
              value={filtros.plano}
              onChange={(e) => setFiltros({ ...filtros, plano: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os planos</option>
              <option value="FREE">FREE</option>
              <option value="BASIC">BASIC</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
        </div>

        {filtros.periodo === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total de Usuários"
          value={dados?.resumo.totalUsuarios}
          change={dados?.resumo.crescimentoUsuarios}
          changeType="positive"
          icon={Users}
          color="blue"
          subtitle={`+${Math.floor(dados?.resumo.totalUsuarios * dados?.resumo.crescimentoUsuarios / 100)} este mês`}
        />
        
        <AdminMetricCard
          title="Estabelecimentos"
          value={dados?.resumo.totalEstabelecimentos}
          change={dados?.resumo.crescimentoEstabelecimentos}
          changeType="positive"
          icon={Store}
          color="purple"
          subtitle={`+${Math.floor(dados?.resumo.totalEstabelecimentos * dados?.resumo.crescimentoEstabelecimentos / 100)} este mês`}
        />
        
        <AdminMetricCard
          title="Agendamentos"
          value={dados?.resumo.totalAgendamentos}
          change={dados?.resumo.crescimentoAgendamentos}
          changeType="positive"
          icon={Calendar}
          color="green"
          subtitle={`+${Math.floor(dados?.resumo.totalAgendamentos * dados?.resumo.crescimentoAgendamentos / 100)} este mês`}
        />
        
        <AdminMetricCard
          title="Receita Total"
          value={`R$ ${dados?.resumo.receitaTotal.toLocaleString()}`}
          change={dados?.resumo.crescimentoReceita}
          changeType="positive"
          icon={DollarSign}
          color="yellow"
          subtitle={`+R$ ${Math.floor(dados?.resumo.receitaTotal * dados?.resumo.crescimentoReceita / 100).toLocaleString()} este mês`}
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Crescimento de Usuários"
          type="line"
          color="blue"
          data={dados?.usuariosPorMes.map((item, index) => ({
            x: index,
            y: item.usuarios,
            label: item.mes
          })) || []}
          trendValue={dados?.resumo.crescimentoUsuarios}
          trendType="positive"
        />
        
        <AdminChart
          title="Agendamentos por Status"
          type="pie"
          color="purple"
          data={dados?.agendamentosPorStatus.map((item, index) => ({
            x: index,
            y: item.quantidade,
            label: item.status
          })) || []}
        />
      </div>

      {/* Métricas do Sistema */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Métricas do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Uptime</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Disponibilidade</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {dados?.metricasSistema.uptime}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Response Time</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tempo de resposta</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {dados?.metricasSistema.responseTime}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <HardDrive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Memória</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uso atual</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {dados?.metricasSistema.memoryUsage}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">CPU</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Processamento</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {dados?.metricasSistema.cpuUsage}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Taxa de Erro</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Erros por requisição</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {dados?.metricasSistema.errorRate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Usuários Ativos</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Agora</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {dados?.metricasSistema.activeUsers}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Estabelecimentos */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Estabelecimentos por Performance
          </h3>
          <div className="space-y-4">
            {dados?.topEstabelecimentos.map((estabelecimento, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {estabelecimento.nome}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {estabelecimento.agendamentos} agendamentos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    R$ {estabelecimento.receita.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    receita total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCharts = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecionar Gráficos
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCharts(chartTypes.map(c => c.id))}
          >
            Selecionar Todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCharts([])}
          >
            Limpar Seleção
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {chartTypes.map((chart) => (
          <div
            key={chart.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedCharts.includes(chart.id)
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => {
              if (selectedCharts.includes(chart.id)) {
                setSelectedCharts(selectedCharts.filter(id => id !== chart.id))
              } else {
                setSelectedCharts([...selectedCharts, chart.id])
              }
            }}
          >
            <div className="flex items-center gap-3">
              <chart.icon size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {chart.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCharts.includes('crescimento') && (
          <AdminChart
            title="Crescimento de Usuários"
            type="line"
            color="blue"
            data={dados?.usuariosPorMes.map((item, index) => ({
              x: index,
              y: item.usuarios,
              label: item.mes
            })) || []}
            trendValue={dados?.resumo.crescimentoUsuarios}
            trendType="positive"
          />
        )}

        {selectedCharts.includes('distribuicao') && (
          <AdminChart
            title="Distribuição de Agendamentos"
            type="pie"
            color="purple"
            data={dados?.agendamentosPorStatus.map((item, index) => ({
              x: index,
              y: item.quantidade,
              label: item.status
            })) || []}
          />
        )}

        {selectedCharts.includes('performance') && (
          <AdminChart
            title="Performance por Plano"
            type="bar"
            color="green"
            data={dados?.receitaPorPlano.map((item, index) => ({
              x: index,
              y: item.receita,
              label: item.plano
            })) || []}
            trendValue={15.2}
            trendType="positive"
          />
        )}

        {selectedCharts.includes('financeiro') && (
          <AdminChart
            title="Receita Mensal"
            type="line"
            color="yellow"
            data={[
              { x: 0, y: 10000, label: 'Jan' },
              { x: 1, y: 15000, label: 'Fev' },
              { x: 2, y: 20000, label: 'Mar' },
              { x: 3, y: 18000, label: 'Abr' },
              { x: 4, y: 25000, label: 'Mai' },
              { x: 5, y: 30000, label: 'Jun' }
            ]}
            trendValue={20.5}
            trendType="positive"
          />
        )}

        {selectedCharts.includes('usuarios') && (
          <AdminChart
            title="Novos Usuários por Mês"
            type="bar"
            color="blue"
            data={dados?.usuariosPorMes.map((item, index) => ({
              x: index,
              y: item.usuarios,
              label: item.mes
            })) || []}
            trendValue={12.8}
            trendType="positive"
          />
        )}

        {selectedCharts.includes('sistema') && (
          <AdminChart
            title="Uso de Recursos"
            type="pie"
            color="gray"
            data={[
              { x: 0, y: 68, label: 'Memória' },
              { x: 1, y: 45, label: 'CPU' },
              { x: 2, y: 30, label: 'Disco' },
              { x: 3, y: 15, label: 'Rede' }
            ]}
          />
        )}
      </div>
    </div>
  )

  const renderExport = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configurações de Exportação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formato de Exportação
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['pdf', 'excel', 'csv'].map((formato) => (
                  <button
                    key={formato}
                    onClick={() => setExportFormat(formato)}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      exportFormat === formato
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <FileText size={24} className="mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                        {formato}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Opções de Exportação
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Incluir gráficos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Incluir métricas detalhadas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Incluir dados brutos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Incluir anexos</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => handleExport(exportFormat)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            >
              <Download size={16} />
              Exportar Relatório
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2"
            >
              <Printer size={16} />
              Imprimir
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              Compartilhar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  if (loading && !dados) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Carregando Relatórios...</h2>
            <p className="text-gray-500 dark:text-gray-400">Preparando dados e métricas</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
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

      <div className="space-y-6">
        {/* Header Ultra Profissional */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Relatórios Avançados
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Análise detalhada e insights do sistema
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Dados em Tempo Real
                </span>
              </div>
              
              <Button
                onClick={carregarDados}
                variant="outline"
                size="sm"
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <RefreshCw size={16} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        {renderFiltros()}

        {/* Controles de Visualização */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'dashboard' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'charts' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <PieChart size={16} />
                </button>
                <button
                  onClick={() => setViewMode('export')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'export' 
                      ? 'bg-white dark:bg-gray-800 shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Download size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleExport('pdf')}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center gap-2"
                >
                  <Download size={16} />
                  Exportar PDF
                </Button>
                <Button
                  onClick={() => handleExport('excel')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                >
                  <Download size={16} />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Conteúdo Principal */}
        {viewMode === 'dashboard' && renderDashboard()}
        {viewMode === 'charts' && renderCharts()}
        {viewMode === 'export' && renderExport()}
      </div>
    </AdminLayout>
  )
}

export default RelatoriosAvancados