import { useNavigate } from 'react-router-dom'
import { Calendar, Store, Sparkles, Users, Clock, Star, TrendingUp, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import AnimatedNumber from '../components/AnimatedNumber'
import Logo from '../components/Logo'
import estatisticasService from '../services/estatisticasService'

const Home = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    estabelecimentos: 0,
    agendamentos: 0,
    avaliacoes: 0,
    usuarios: 0
  })

  // Buscar estatísticas reais da API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await estatisticasService.getEstatisticas()
        setStats({
          estabelecimentos: data.totalEstabelecimentos || 0,
          agendamentos: data.totalAgendamentos || 0,
          avaliacoes: data.totalAvaliacoes || 0,
          usuarios: data.totalUsuariosAtivos || 0
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        // Manter dados padrão em caso de erro
        setStats({
          estabelecimentos: 0,
          agendamentos: 0,
          avaliacoes: 0,
          usuarios: 0
        })
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 relative overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary-300/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-300/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          {/* Logo Principal */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              {/* Efeito de sombra suave */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
              
              {/* Logo com efeito de destaque */}
              <div className="relative transform group-hover:scale-105 transition-all duration-300 group-hover:rotate-1">
                <Logo size="2xl" />
              </div>
              
              {/* Efeito de brilho sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Badge de destaque */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 text-sm font-semibold mb-6 animate-bounce-in">
            <Zap size={16} className="text-yellow-600" />
            {stats.agendamentos > 0 ? `Mais de ${stats.agendamentos} agendamentos realizados!` : 'Sistema de agendamento inteligente!'}
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa e moderna para agendamento de horários entre clientes e estabelecimentos de estética
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login/cliente')}
              className="min-w-[200px]"
            >
              <Calendar size={20} />
              Sou Cliente
            </Button>
            
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/login/estabelecimento')}
              className="min-w-[200px]"
            >
              <Store size={20} />
              Sou Estabelecimento
            </Button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/planos')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm underline transition-colors"
            >
              Ver Planos e Preços
            </button>
          </div>

          {/* Estatísticas em Tempo Real */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Store className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedNumber value={stats.estabelecimentos} />+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Estabelecimentos
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Calendar className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedNumber value={stats.agendamentos} />+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Agendamentos
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Star className="text-yellow-600 dark:text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedNumber value={stats.avaliacoes} />+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Avaliações
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Users className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedNumber value={stats.usuarios} />+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Usuários Ativos
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <Card hoverable className="text-center group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-2xl group-hover:bg-primary-600/30 transition-all"></div>
              <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform" size={32} />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Agendamento Fácil
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Encontre estabelecimentos e agende seus serviços de forma rápida e intuitiva
            </p>
          </Card>

          <Card hoverable className="text-center group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-600/20 rounded-full blur-2xl group-hover:bg-green-600/30 transition-all"></div>
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Store className="text-green-600 dark:text-green-400 group-hover:rotate-12 transition-transform" size={32} />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              Gestão Completa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Gerencie agenda, serviços e clientes em um único lugar de forma profissional
            </p>
          </Card>

          <Card hoverable className="text-center group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-2xl group-hover:bg-purple-600/30 transition-all"></div>
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/30 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" size={32} />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Interface Moderna
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Design limpo e responsivo para a melhor experiência em qualquer dispositivo
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-8">
            Crie sua conta gratuitamente e comece a agendar hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate('/cadastro/cliente')}
            >
              Cadastro Cliente
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/cadastro/estabelecimento')}
            >
              Cadastro Estabelecimento
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 JFAgende. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home

