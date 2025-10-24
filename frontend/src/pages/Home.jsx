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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 relative overflow-hidden">
      {/* Animated mesh gradient background - otimizado para mobile */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-15">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary-500/20 sm:bg-primary-500/30 rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 sm:bg-purple-500/30 rounded-full blur-2xl sm:blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/20 sm:bg-pink-500/30 rounded-full blur-2xl sm:blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 sm:bg-blue-500/30 rounded-full blur-2xl sm:blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Grid pattern overlay - responsivo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"></div>

      {/* Hero Section - otimizado para mobile */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 animate-fade-in-up">
          {/* Logo Principal - otimizado para mobile */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
            <div className="relative group">
              {/* Glow effect sutil - responsivo */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 rounded-full blur-xl sm:blur-2xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-30 transition-all duration-500"></div>
              
              {/* Logo com efeito suave - tamanhos responsivos */}
              <div className="relative transform group-hover:scale-105 transition-all duration-300">
                <Logo size="xl" className="sm:hidden" />
                <Logo size="2xl" className="hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Badge de destaque moderno - otimizado para mobile */}
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl glass-strong border-2 border-primary-500/30 mb-4 sm:mb-6 md:mb-8 animate-bounce-in hover:scale-105 transition-transform duration-300 cursor-default group">
            <div className="p-1 sm:p-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-md sm:rounded-lg animate-pulse">
              <Zap size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-xs sm:text-sm md:text-base leading-tight">
              {stats.agendamentos > 0 ? `Mais de ${stats.agendamentos} agendamentos!` : 'Sistema inteligente!'}
            </span>
          </div>
          
          {/* Título principal - responsivo */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JFAgende
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-medium px-2 sm:px-4">
            Plataforma <span className="text-primary-600 dark:text-primary-400 font-bold">completa e moderna</span> para agendamento de horários entre clientes e estabelecimentos de estética
          </p>
          
          {/* Botões principais - otimizados para mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 sm:px-4 max-w-md sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              onClick={() => navigate('/login/cliente')}
              className="w-full sm:w-auto sm:min-w-[180px] md:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg font-semibold"
            >
              <Calendar size={18} className="sm:w-5 sm:h-5" />
              <span className="ml-2">Sou Cliente</span>
            </Button>
            
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/login/estabelecimento')}
              className="w-full sm:w-auto sm:min-w-[180px] md:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg font-semibold"
            >
              <Store size={18} className="sm:w-5 sm:h-5" />
              <span className="ml-2">Sou Estabelecimento</span>
            </Button>
          </div>

          <div className="mt-4 sm:mt-6">
            <button
              onClick={() => navigate('/planos')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm sm:text-base underline transition-colors"
            >
              Ver Planos e Preços
            </button>
          </div>

              {/* Estatísticas em Tempo Real - otimizadas para mobile */}
              <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-6xl mx-auto px-2 sm:px-4">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative glass-strong rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2 sm:p-3 md:p-4 lg:p-6 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 card-hover">
                    <div className="flex justify-center mb-1 sm:mb-2 md:mb-3 lg:mb-4">
                      <div className="p-1.5 sm:p-2 md:p-3 lg:p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Store className="text-white" size={14} />
                      </div>
                    </div>
                    <div className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2 text-center">
                      <AnimatedNumber value={stats.estabelecimentos} />+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center leading-tight">
                      Estabelecimentos
                    </div>
                  </div>
                </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2 sm:p-3 md:p-4 lg:p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-1 sm:mb-2 md:mb-3 lg:mb-4">
                  <div className="p-1.5 sm:p-2 md:p-3 lg:p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="text-white" size={14} />
                  </div>
                </div>
                <div className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 sm:mb-2 text-center">
                  <AnimatedNumber value={stats.agendamentos} />+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center leading-tight">
                  Agendamentos
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2 sm:p-3 md:p-4 lg:p-6 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-1 sm:mb-2 md:mb-3 lg:mb-4">
                  <div className="p-1.5 sm:p-2 md:p-3 lg:p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="text-white" size={14} />
                  </div>
                </div>
                <div className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1 sm:mb-2 text-center">
                  <AnimatedNumber value={stats.avaliacoes} />+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center leading-tight">
                  Avaliações
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2 sm:p-3 md:p-4 lg:p-6 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-1 sm:mb-2 md:mb-3 lg:mb-4">
                  <div className="p-1.5 sm:p-2 md:p-3 lg:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white" size={14} />
                  </div>
                </div>
                <div className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2 text-center">
                  <AnimatedNumber value={stats.usuarios} />+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center leading-tight">
                  Usuários Ativos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - otimizada para mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 px-2 sm:px-4">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl md:blur-2xl opacity-0 group-hover:opacity-20 sm:group-hover:opacity-30 transition-all duration-500"></div>
            <Card glass hoverable className="text-center cursor-pointer border-2 border-primary-500/20 hover:border-primary-500/60 group-hover:shadow-2xl p-3 sm:p-4 md:p-6">
              <div className="relative mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <div className="absolute inset-0 bg-primary-600/15 sm:bg-primary-600/20 rounded-full blur-2xl sm:blur-3xl group-hover:bg-primary-600/25 sm:group-hover:bg-primary-600/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex items-center justify-center mx-auto shadow-xl sm:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-gradient">
                  <Calendar className="text-white drop-shadow-lg" size={16} />
                </div>
              </div>
              <h3 className="font-display font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2 md:mb-3 lg:mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform leading-tight">
                Agendamento Fácil
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                Encontre estabelecimentos e agende seus serviços de forma <span className="text-primary-600 dark:text-primary-400 font-bold">rápida e intuitiva</span>
              </p>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl md:blur-2xl opacity-0 group-hover:opacity-20 sm:group-hover:opacity-30 transition-all duration-500"></div>
            <Card glass hoverable className="text-center cursor-pointer border-2 border-emerald-500/20 hover:border-emerald-500/60 group-hover:shadow-2xl p-3 sm:p-4 md:p-6">
              <div className="relative mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <div className="absolute inset-0 bg-emerald-600/15 sm:bg-emerald-600/20 rounded-full blur-2xl sm:blur-3xl group-hover:bg-emerald-600/25 sm:group-hover:bg-emerald-600/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex items-center justify-center mx-auto shadow-xl sm:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-gradient">
                  <Store className="text-white drop-shadow-lg" size={16} />
                </div>
              </div>
              <h3 className="font-display font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2 md:mb-3 lg:mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform leading-tight">
                Gestão Completa
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                Gerencie agenda, serviços e clientes em um único lugar de forma <span className="text-emerald-600 dark:text-emerald-400 font-bold">profissional</span>
              </p>
            </Card>
          </div>

          <div className="group relative sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl md:blur-2xl opacity-0 group-hover:opacity-20 sm:group-hover:opacity-30 transition-all duration-500"></div>
            <Card glass hoverable className="text-center cursor-pointer border-2 border-purple-500/20 hover:border-purple-500/60 group-hover:shadow-2xl p-3 sm:p-4 md:p-6">
              <div className="relative mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <div className="absolute inset-0 bg-purple-600/15 sm:bg-purple-600/20 rounded-full blur-2xl sm:blur-3xl group-hover:bg-purple-600/25 sm:group-hover:bg-purple-600/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex items-center justify-center mx-auto shadow-xl sm:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-gradient">
                  <Sparkles className="text-white drop-shadow-lg" size={16} />
                </div>
              </div>
              <h3 className="font-display font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2 md:mb-3 lg:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform leading-tight">
                Interface Moderna
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                Design limpo e responsivo para a melhor experiência em <span className="text-purple-600 dark:text-purple-400 font-bold">qualquer dispositivo</span>
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 sm:mt-24 md:mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl blur-3xl"></div>
          <Card glass className="relative border-2 border-primary-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5 animate-gradient"></div>
            <div className="relative text-center py-12 sm:py-16 px-4 sm:px-8">
              <div className="inline-block mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-2xl animate-float">
                  <Sparkles className="text-white" size={32} />
                </div>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pronto para começar?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto font-medium">
                Crie sua conta <span className="text-primary-600 dark:text-primary-400 font-bold">gratuitamente</span> e comece a agendar hoje mesmo
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/cadastro/cliente')}
                  className="group w-full sm:w-auto"
                >
                  <Users size={18} className="group-hover:scale-110 transition-transform" />
                  Cadastro Cliente
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/cadastro/estabelecimento')}
                  className="group w-full sm:w-auto"
                >
                  <Store size={18} className="group-hover:scale-110 transition-transform" />
                  Cadastro Estabelecimento
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50 mt-32 py-12 glass">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-lg bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  JFAgende
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Agende com Estilo
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                © 2025 JFAgende. Todos os direitos reservados.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Feito com 💜 para revolucionar agendamentos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

