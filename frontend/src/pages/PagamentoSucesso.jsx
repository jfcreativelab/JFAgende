import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Logo from '../components/Logo'

const PagamentoSucesso = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-900 dark:to-green-900/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        {/* Ícone de sucesso */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pagamento Realizado com Sucesso!
        </h1>

        {/* Mensagem */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos do seu plano.
        </p>

        {/* ID da sessão */}
        {sessionId && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              ID da Sessão:
            </p>
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="space-y-3">
          <Button
            fullWidth
            onClick={() => navigate('/estabelecimento/dashboard')}
          >
            <Home size={18} />
            Ir para Dashboard
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/assinatura')}
          >
            <ArrowRight size={18} />
            Ver Minha Assinatura
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PagamentoSucesso



















