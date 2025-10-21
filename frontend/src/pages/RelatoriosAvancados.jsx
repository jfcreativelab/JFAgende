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
  FileText
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Loading from '../components/Loading'

const RelatoriosAvancados = () => {
  const [loading, setLoading] = useState(false)
  const [filtros, setFiltros] = useState({
    periodo: '30d',
    tipoRelatorio: 'geral',
    estabelecimento: '',
    plano: '',
    status: ''
  })
  const [dados, setDados] = useState(null)
  const [viewMode, setViewMode] = useState('chart')

  const tiposRelatorio = [
    { id: 'geral', label: 'Relatório Geral', icon: BarChart3 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'performance', label: 'Performance', icon: Activity }
  ]

  const periodos = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ]

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
          totalUsuarios: 0,
          totalEstabelecimentos: 0,
          totalAgendamentos: 0,
          receitaTotal: 0,
          crescimentoUsuarios: 0,
          crescimentoEstabelecimentos: 0,
          crescimentoAgendamentos: 0
        },
        usuariosPorMes: [],
        agendamentosPorStatus: [],
        receitaPorPlano: [],
        topEstabelecimentos: []
      }
      
      setDados(dadosSimulados)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [filtros])

  const handleExport = (formato) => {
    console.log(`Exportando relatório em formato ${formato}`)
    // Implementar exportação real
  }

  const renderFiltros = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtros
        </h3>
        <Button
          variant="outline"
          onClick={carregarDados}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </Button>
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
    </Card>
  )

  const renderResumo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total de Usuários
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {dados?.resumo.totalUsuarios.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                +{dados?.resumo.crescimentoUsuarios}% este mês
              </span>
            </div>
          </div>
          <Users size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Estabelecimentos
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {dados?.resumo.totalEstabelecimentos}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                +{dados?.resumo.crescimentoUsuarios}% este mês
              </span>
            </div>
          </div>
          <Store size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Agendamentos
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {dados?.resumo.totalAgendamentos.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                +{dados?.resumo.crescimentoAgendamentos}% este mês
              </span>
            </div>
          </div>
          <Calendar size={32} className="text-green-600 dark:text-green-400" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Receita Total
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              R$ {dados?.resumo.receitaTotal.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                +{dados?.resumo.crescimentoReceita}% este mês
              </span>
            </div>
          </div>
          <DollarSign size={32} className="text-yellow-600 dark:text-yellow-400" />
        </div>
      </Card>
    </div>
  )

  const renderGraficos = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Crescimento de Usuários
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('chart')}
              className={viewMode === 'chart' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
            >
              <BarChart3 size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
            >
              <FileText size={16} />
            </Button>
          </div>
        </div>
        
        {viewMode === 'chart' ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Gráfico de crescimento</p>
              <p className="text-sm text-gray-400">Implementar com biblioteca de gráficos</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {dados?.usuariosPorMes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">{item.mes}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.usuarios} usuários
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.estabelecimentos} estabelecimentos
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Agendamentos por Status
          </h3>
          <PieChart size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {dados?.agendamentosPorStatus.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${
                  item.status === 'CONFIRMADO' ? 'bg-green-500' :
                  item.status === 'PENDENTE' ? 'bg-yellow-500' :
                  item.status === 'CONCLUIDO' ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.status}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.quantidade}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({item.porcentagem}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderTopEstabelecimentos = () => (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Estabelecimentos
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('csv')}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>
      
      <div className="space-y-3">
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
    </Card>
  )

  if (loading && !dados) {
    return (
      <AdminLayout>
        <Loading fullScreen />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Relatórios Avançados
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Análise detalhada e insights do sistema
            </p>
          </div>
          
          <div className="flex items-center gap-3">
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

        {/* Filtros */}
        {renderFiltros()}

        {/* Resumo */}
        {renderResumo()}

        {/* Gráficos */}
        {renderGraficos()}

        {/* Top Estabelecimentos */}
        {renderTopEstabelecimentos()}
      </div>
    </AdminLayout>
  )
}

export default RelatoriosAvancados

