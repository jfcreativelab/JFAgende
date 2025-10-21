import { useState, useEffect } from 'react'
import { Copy, Check, QrCode, Clock, DollarSign, Smartphone, CreditCard } from 'lucide-react'
import Button from './Button'
import Card from './Card'
import QRCode from 'qrcode'

const PixPayment = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError, 
  onCancel,
  pixKey = 'jfagende@pagamento.com',
  merchantName = 'JFAgende'
}) => {
  const [qrCode, setQrCode] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, paid, expired, error

  useEffect(() => {
    generatePixPayment()
  }, [amount])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setPaymentStatus('expired')
    }
  }, [timeLeft])

  const generatePixPayment = async () => {
    setIsLoading(true)
    try {
      // Simular geração do PIX (em produção, chamaria a API)
      const pixData = {
        key: pixKey,
        amount: amount,
        merchant: merchantName,
        description: `Pagamento JFAgende - R$ ${amount.toFixed(2)}`,
        transactionId: `PIX_${Date.now()}`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }

      // Gerar código PIX (formato simplificado)
      const pixCodeString = `00020126580014br.gov.bcb.pix0136${pixData.transactionId}520400005303986540${amount.toFixed(2)}5802BR5913${merchantName}6009SAO PAULO62070503***6304`
      setPixCode(pixCodeString)

      // Gerar QR Code
      const qrCodeDataURL = await QRCode.toDataURL(pixCodeString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCode(qrCodeDataURL)

      // Simular verificação de pagamento
      checkPaymentStatus(pixData.transactionId)
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      onPaymentError?.('Erro ao gerar código PIX')
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = (transactionId) => {
    // Simular verificação de pagamento a cada 5 segundos
    const interval = setInterval(async () => {
      try {
        // Em produção, faria uma chamada para a API
        const isPaid = Math.random() > 0.95 // 5% de chance de pagamento a cada verificação
        
        if (isPaid) {
          setPaymentStatus('paid')
          clearInterval(interval)
          onPaymentSuccess?.({
            transactionId,
            amount,
            method: 'PIX',
            paidAt: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
      }
    }, 5000)

    // Limpar interval após 15 minutos
    setTimeout(() => {
      clearInterval(interval)
    }, 15 * 60 * 1000)
  }

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'paid': return 'Pagamento Confirmado!'
      case 'expired': return 'Pagamento Expirado'
      case 'error': return 'Erro no Pagamento'
      default: return 'Aguardando Pagamento'
    }
  }

  if (paymentStatus === 'paid') {
    return (
      <Card className="text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Pagamento Confirmado!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Seu pagamento de R$ {amount.toFixed(2)} foi processado com sucesso.
        </p>
        <Button onClick={() => window.location.reload()}>
          Continuar
        </Button>
      </Card>
    )
  }

  if (paymentStatus === 'expired') {
    return (
      <Card className="text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="text-red-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-red-600 mb-2">
          Pagamento Expirado
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          O tempo para pagamento expirou. Gere um novo código PIX.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={generatePixPayment}>
            Gerar Novo PIX
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="text-primary-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pagamento PIX
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Escaneie o QR Code ou copie o código PIX
        </p>
      </div>

      {/* Valor */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          R$ {amount.toFixed(2)}
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          <Clock size={16} className="mr-2" />
          {getStatusText()}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Tempo restante para pagamento
        </div>
        <div className="text-2xl font-mono font-bold text-primary-600">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* QR Code */}
      {qrCode && (
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
            <img src={qrCode} alt="QR Code PIX" className="w-64 h-64" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Escaneie com seu app de banco
          </p>
        </div>
      )}

      {/* Código PIX */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Código PIX (Copiar e Colar)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
              {pixCode}
            </code>
          </div>
          <Button
            onClick={copyPixCode}
            variant="outline"
            className="px-4"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Como pagar com PIX:
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. Abra o app do seu banco</li>
          <li>2. Escaneie o QR Code ou cole o código PIX</li>
          <li>3. Confirme o pagamento</li>
          <li>4. Aguarde a confirmação automática</li>
        </ol>
      </div>

      {/* Chave PIX */}
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Chave PIX do estabelecimento:
        </div>
        <div className="font-mono text-sm text-gray-900 dark:text-white">
          {pixKey}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={generatePixPayment}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Gerando...' : 'Atualizar PIX'}
        </Button>
      </div>
    </Card>
  )
}

export default PixPayment
