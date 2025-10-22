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
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"></div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          {/* Logo Principal */}
          <div className="flex items-center justify-center mb-10">
            <div className="relative group">
              {/* Glow effect sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              
              {/* Logo com efeito suave */}
              <div className="relative transform group-hover:scale-105 transition-all duration-300">
                <Logo size="2xl" />
              </div>
            </div>
          </div>

          {/* Badge de destaque moderno */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-strong border-2 border-primary-500/30 mb-8 animate-bounce-in hover:scale-105 transition-transform duration-300 cursor-default group">
            <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg animate-pulse">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stats.agendamentos > 0 ? `Mais de ${stats.agendamentos} agendamentos realizados!` : 'Sistema de agendamento inteligente!'}
            </span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Plataforma <span className="text-primary-600 dark:text-primary-400 font-bold">completa e moderna</span> para agendamento de horários entre clientes e estabelecimentos de estética
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
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-3xl p-6 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Store className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stats.estabelecimentos} />+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Estabelecimentos
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-3xl p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stats.agendamentos} />+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Agendamentos
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-3xl p-6 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stats.avaliacoes} />+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Avaliações
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative glass-strong rounded-3xl p-6 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 card-hover">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stats.usuarios} />+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Usuários Ativos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <Card glass hoverable className="text-center cursor-pointer border-2 border-primary-500/20 hover:border-primary-500/60 group-hover:shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-3xl group-hover:bg-primary-600/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-gradient">
                  <Calendar className="text-white drop-shadow-lg" size={40} />
                </div>
              </div>
              <h3 className="font-display font-black text-2xl mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Agendamento Fácil
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-medium">
                Encontre estabelecimentos e agende seus serviços de forma <span className="text-primary-600 dark:text-primary-400 font-bold">rápida e intuitiva</span>
              </p>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <Card glass hoverable className="text-center cursor-pointer border-2 border-emerald-500/20 hover:border-emerald-500/60 group-hover:shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-600/20 rounded-full blur-3xl group-hover:bg-emerald-600/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-gradient">
                  <Store className="text-white drop-shadow-lg" size={40} />
                </div>
              </div>
              <h3 className="font-display font-black text-2xl mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Gestão Completa
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-medium">
                Gerencie agenda, serviços e clientes em um único lugar de forma <span className="text-emerald-600 dark:text-emerald-400 font-bold">profissional</span>
              </p>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <Card glass hoverable className="text-center cursor-pointer border-2 border-purple-500/20 hover:border-purple-500/60 group-hover:shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-gradient">
                  <Sparkles className="text-white drop-shadow-lg" size={40} />
                </div>
              </div>
              <h3 className="font-display font-black text-2xl mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Interface Moderna
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-medium">
                Design limpo e responsivo para a melhor experiência em <span className="text-purple-600 dark:text-purple-400 font-bold">qualquer dispositivo</span>
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
          <Card glass className="relative border-2 border-primary-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5 animate-gradient"></div>
            <div className="relative text-center py-16 px-8">
              <div className="inline-block mb-6">
                <div className="p-4 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl animate-float">
                  <Sparkles className="text-white" size={40} />
                </div>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pronto para começar?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
                Crie sua conta <span className="text-primary-600 dark:text-primary-400 font-bold">gratuitamente</span> e comece a agendar hoje mesmo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/cadastro/cliente')}
                  className="group"
                >
                  <Users size={20} className="group-hover:scale-110 transition-transform" />
                  Cadastro Cliente
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/cadastro/estabelecimento')}
                  className="group"
                >
                  <Store size={20} className="group-hover:scale-110 transition-transform" />
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

