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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informações do Estabelecimento */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex gap-6 mb-6">
                <div className="flex-shrink-0 w-32 h-32 bg-primary-100 rounded-xl flex items-center justify-center">
                  {estabelecimento.fotoPerfilUrl ? (
                    <img 
                      src={`https://jfagende-production.up.railway.app${estabelecimento.fotoPerfilUrl}`} 
                      alt={estabelecimento.nome}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : estabelecimento.imagemCapa ? (
                    <img 
                      src={estabelecimento.imagemCapa} 
                      alt={estabelecimento.nome}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <MapPin className="text-primary-600" size={48} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                        {estabelecimento.nome}
                      </h1>
                      <div className="flex items-center gap-3">
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
                      className="!p-2"
                    >
                      <Heart 
                        size={24}
                        className={`transition-colors ${
                          isFavorito 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </Button>
                  </div>
                  
                  {estabelecimento.descricao && (
                    <p className="text-gray-600 mb-4">
                      {estabelecimento.descricao}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{estabelecimento.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      <span>{estabelecimento.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={18} />
                      <span>{estabelecimento.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div>
              <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setAbaAtiva('servicos')}
                  className={`px-6 py-3 font-medium transition-all ${
                    abaAtiva === 'servicos'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <DollarSign className="inline mr-2" size={18} />
                  Serviços
                </button>

                {fotosPortfolio.length > 0 && (
                  <button
                    onClick={() => setAbaAtiva('portfolio')}
                    className={`px-6 py-3 font-medium transition-all ${
                      abaAtiva === 'portfolio'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <ImageIcon className="inline mr-2" size={18} />
                    Portfólio ({fotosPortfolio.length})
                  </button>
                )}

                <button
                  onClick={() => setAbaAtiva('avaliacoes')}
                  className={`px-6 py-3 font-medium transition-all ${
                    abaAtiva === 'avaliacoes'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Star className="inline mr-2" size={18} />
                  Avaliações ({avaliacoes.total})
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
