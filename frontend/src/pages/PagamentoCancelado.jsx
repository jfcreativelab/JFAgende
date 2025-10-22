import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Logo from '../components/Logo'

const PagamentoCancelado = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-gray-900 dark:via-gray-900 dark:to-red-900/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        {/* Ícone de cancelamento */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle size={48} className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pagamento Cancelado
        </h1>

        {/* Mensagem */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          O pagamento foi cancelado. Você pode tentar novamente a qualquer momento.
        </p>

        {/* Botões */}
        <div className="space-y-3">
          <Button
            fullWidth
            onClick={() => navigate('/planos')}
          >
            <RefreshCw size={18} />
            Tentar Novamente
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/estabelecimento/dashboard')}
          >
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PagamentoCancelado




















