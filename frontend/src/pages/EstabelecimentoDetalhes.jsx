import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Mail, Clock, DollarSign, Heart, Star, MessageSquare, Image as ImageIcon } from 'lucide-react'
import estabelecimentoService from '../services/estabelecimentoService'
import avaliacaoService from '../services/avaliacaoService'
import favoritoService from '../services/favoritoService'
import portfolioService from '../services/portfolioService'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import StarRating from '../components/StarRating'
import AvaliacaoCard from '../components/AvaliacaoCard'
import GaleriaPortfolio from '../components/GaleriaPortfolio'
import LogoEstabelecimento from '../components/LogoEstabelecimento'
import Toast from '../components/Toast'

const EstabelecimentoDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [estabelecimento, setEstabelecimento] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState({ avaliacoes: [], total: 0, media: 0 })
  const [fotosPortfolio, setFotosPortfolio] = useState([])
  const [isFavorito, setIsFavorito] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [abaAtiva, setAbaAtiva] = useState('servicos')

  useEffect(() => {
    carregarDados()
  }, [id])

  const carregarDados = async () => {
    try {
      const [estabelecimentoData, avaliacoesData, favoritoData, fotosData] = await Promise.all([
        estabelecimentoService.getById(id),
        avaliacaoService.getByEstabelecimento(id),
        favoritoService.check(id).catch(() => ({ isFavorito: false })),
        portfolioService.getFotos(id).catch(() => [])
      ])
      
      setEstabelecimento(estabelecimentoData)
      setAvaliacoes(avaliacoesData)
      setIsFavorito(favoritoData.isFavorito)
      setFotosPortfolio(fotosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorito = async () => {
    try {
      if (isFavorito) {
        await favoritoService.remove(id)
        setToast({ type: 'success', message: 'Removido dos favoritos' })
        setIsFavorito(false)
      } else {
        await favoritoService.add(id)
        setToast({ type: 'success', message: 'Adicionado aos favoritos!' })
        setIsFavorito(true)
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Erro ao atualizar favoritos' })
    }
  }

  const getDiaSemana = (dia) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return dias[dia]
  }

  if (loading) {
    return <Loading fullScreen />
  }

  if (!estabelecimento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-gray-600">Estabelecimento não encontrado</p>
          <Button onClick={() => navigate('/cliente/dashboard')} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/cliente/dashboard')}
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Informações do Estabelecimento */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary-100 via-purple-100 to-pink-100 dark:from-primary-900 dark:via-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-primary-500/20 mx-auto sm:mx-0 relative">
                  <LogoEstabelecimento 
                    estabelecimento={estabelecimento}
                    className="w-full h-full object-cover"
                    fallbackClassName="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl"
                    showDebug={window.innerWidth < 768}
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1">
                      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {estabelecimento.nome}
                      </h1>
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <Badge variant="primary">
                          {estabelecimento.categoria}
                        </Badge>
                        {avaliacoes.total > 0 && (
                          <div className="flex items-center gap-1">
                            <StarRating rating={avaliacoes.media} readOnly size={16} />
                            <span className="text-sm text-gray-600">
                              ({avaliacoes.total} {avaliacoes.total === 1 ? 'avaliação' : 'avaliações'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Botão de Favorito */}
                    <Button
                      variant="ghost"
                      onClick={handleToggleFavorito}
                      className="!p-2 mt-2 sm:mt-0"
                    >
                      <Heart 
                        size={20}
                        className={`transition-colors ${
                          isFavorito 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </Button>
                  </div>
                  
                  {estabelecimento.descricao && (
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      {estabelecimento.descricao}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="break-words">{estabelecimento.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{estabelecimento.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span className="break-all">{estabelecimento.email}</span>
                    </div>
                  </div>

                  {/* Horários de Funcionamento */}
                  {estabelecimento.horarios && estabelecimento.horarios.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Clock size={20} />
                        Horários de Funcionamento
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {estabelecimento.horarios.map((horario, index) => {
                          const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
                          const hoje = new Date().getDay()
                          const isHoje = horario.diaSemana === hoje
                          
                          return (
                            <div 
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isHoje 
                                  ? 'bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700' 
                                  : 'bg-gray-50 dark:bg-gray-800'
                              }`}
                            >
                              <span className={`font-medium ${isHoje ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                {diasSemana[horario.diaSemana]}
                                {isHoje && <span className="ml-2 text-xs">(Hoje)</span>}
                              </span>
                              <span className={`text-sm ${isHoje ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {horario.horaInicio} - {horario.horaFim}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div>
              <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                  onClick={() => setAbaAtiva('servicos')}
                  className={`px-3 py-2 sm:px-6 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    abaAtiva === 'servicos'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <DollarSign className="inline mr-1 sm:mr-2" size={16} />
                  Serviços
                </button>

                {fotosPortfolio.length > 0 && (
                  <button
                    onClick={() => setAbaAtiva('portfolio')}
                    className={`px-3 py-2 sm:px-6 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                      abaAtiva === 'portfolio'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <ImageIcon className="inline mr-1 sm:mr-2" size={16} />
                    <span className="hidden sm:inline">Portfólio ({fotosPortfolio.length})</span>
                    <span className="sm:hidden">Fotos ({fotosPortfolio.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setAbaAtiva('avaliacoes')}
                  className={`px-3 py-2 sm:px-6 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    abaAtiva === 'avaliacoes'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Star className="inline mr-1 sm:mr-2" size={16} />
                  <span className="hidden sm:inline">Avaliações ({avaliacoes.total})</span>
                  <span className="sm:hidden">Aval. ({avaliacoes.total})</span>
                </button>
              </div>

              {/* Conteúdo Serviços */}
              {abaAtiva === 'servicos' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Serviços Disponíveis
                  </h2>
                  
                  <div className="grid gap-4">
                    {estabelecimento.servicos.length === 0 ? (
                      <Card>
                        <p className="text-center text-gray-500 py-4">
                          Nenhum serviço cadastrado ainda
                        </p>
                      </Card>
                    ) : (
                      estabelecimento.servicos.map((servico) => (
                        <Card key={servico.id} hoverable>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                {servico.nome}
                              </h3>
                              
                              {servico.descricao && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {servico.descricao}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                  <Clock size={16} />
                                  <span>{servico.duracaoMin} min</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-primary-600 font-semibold">
                                  <DollarSign size={16} />
                                  <span>R$ {servico.preco.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => navigate(`/agendamento/${estabelecimento.id}/${servico.id}`)}
                            >
                              Agendar
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Conteúdo Portfólio */}
              {abaAtiva === 'portfolio' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    📸 Portfólio de Trabalhos
                  </h2>
                  
                  <GaleriaPortfolio fotos={fotosPortfolio} />
                </div>
              )}

              {/* Conteúdo Avaliações */}
              {abaAtiva === 'avaliacoes' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    ⭐ Avaliações de Clientes
                  </h2>
                  
                  {avaliacoes.avaliacoes.length === 0 ? (
                    <Card>
                      <p className="text-center text-gray-500 py-8">
                        Nenhuma avaliação ainda
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {avaliacoes.avaliacoes.map((avaliacao) => (
                        <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Horários */}
          <div>
            <Card>
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Horários de Funcionamento
              </h3>
              
              {estabelecimento.horarios.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Horários não informados
                </p>
              ) : (
                <div className="space-y-3">
                  {estabelecimento.horarios
                    .sort((a, b) => a.diaSemana - b.diaSemana)
                    .map((horario) => (
                      <div key={horario.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {getDiaSemana(horario.diaSemana)}
                        </span>
                        <span className="text-gray-600">
                          {horario.horaInicio} - {horario.horaFim}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstabelecimentoDetalhes
