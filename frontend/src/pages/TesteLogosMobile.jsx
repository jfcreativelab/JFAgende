import { useState, useEffect } from 'react'
import { ArrowLeft, Smartphone, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LogoEstabelecimento from '../components/LogoEstabelecimento'
import Button from '../components/Button'
import Card from '../components/Card'

const TesteLogosMobile = () => {
  const navigate = useNavigate()
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState({})

  useEffect(() => {
    carregarEstabelecimentos()
  }, [])

  const carregarEstabelecimentos = async () => {
    try {
      const response = await fetch('https://jfagende-production.up.railway.app/api/estabelecimentos')
      const data = await response.json()
      setEstabelecimentos(data || [])
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const testarLogo = (estabelecimento) => {
    const testKey = `test_${estabelecimento.id}`
    setTestResults(prev => ({
      ...prev,
      [testKey]: {
        status: 'testing',
        estabelecimento: estabelecimento.nome,
        timestamp: new Date().toISOString()
      }
    }))

    // Simular teste (o componente LogoEstabelecimento já faz o teste real)
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          ...prev[testKey],
          status: 'completed',
          result: 'success' // O componente já testa automaticamente
        }
      }))
    }, 1000)
  }

  const testarTodos = () => {
    estabelecimentos.forEach(estabelecimento => {
      testarLogo(estabelecimento)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Carregando estabelecimentos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Smartphone className="text-primary-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Teste Logos Mobile
            </h1>
          </div>
        </div>

        {/* Info do Dispositivo */}
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3">Informações do Dispositivo</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Dispositivo:</strong>
              <p className="text-gray-600 dark:text-gray-400">
                {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
              </p>
            </div>
            <div>
              <strong>Tela:</strong>
              <p className="text-gray-600 dark:text-gray-400">
                {window.innerWidth}x{window.innerHeight}
              </p>
            </div>
            <div>
              <strong>Hostname:</strong>
              <p className="text-gray-600 dark:text-gray-400">
                {window.location.hostname}
              </p>
            </div>
            <div>
              <strong>Estabelecimentos:</strong>
              <p className="text-gray-600 dark:text-gray-400">
                {estabelecimentos.length} encontrados
              </p>
            </div>
          </div>
        </Card>

        {/* Controles */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Teste de Logos</h2>
            <Button onClick={testarTodos} className="flex items-center gap-2">
              <CheckCircle size={16} />
              Testar Todos
            </Button>
          </div>
        </Card>

        {/* Lista de Estabelecimentos */}
        <div className="space-y-4">
          {estabelecimentos.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Nenhum estabelecimento encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Verifique se a API está funcionando corretamente
              </p>
            </Card>
          ) : (
            estabelecimentos.map((estabelecimento) => {
              const testKey = `test_${estabelecimento.id}`
              const test = testResults[testKey]
              
              return (
                <Card key={estabelecimento.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <LogoEstabelecimento 
                        estabelecimento={estabelecimento}
                        className="w-full h-full object-cover"
                        fallbackClassName="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                        showDebug={true}
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{estabelecimento.nome}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {estabelecimento.categoria}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs">
                        ID: {estabelecimento.id}
                      </p>
                      {estabelecimento.fotoPerfilUrl && (
                        <p className="text-gray-500 dark:text-gray-500 text-xs break-all">
                          URL: {estabelecimento.fotoPerfilUrl}
                        </p>
                      )}
                    </div>
                    
                    {/* Status do Teste */}
                    <div className="flex-shrink-0">
                      {test?.status === 'testing' && (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                      )}
                      {test?.status === 'completed' && test?.result === 'success' && (
                        <CheckCircle size={24} className="text-green-500" />
                      )}
                      {test?.status === 'completed' && test?.result === 'error' && (
                        <XCircle size={24} className="text-red-500" />
                      )}
                      {!test && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testarLogo(estabelecimento)}
                        >
                          Testar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Instruções */}
        <Card className="mt-6 p-4">
          <h2 className="text-lg font-semibold mb-3">Instruções</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>As logos devem aparecer automaticamente nos cards acima</li>
            <li>Se não aparecer, será mostrado um fallback com a inicial do nome</li>
            <li>No mobile, você verá ícones de debug nas logos</li>
            <li>Clique em "Testar Todos" para simular testes</li>
            <li>Verde = sucesso, Vermelho = erro, Azul = debug</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}

export default TesteLogosMobile
