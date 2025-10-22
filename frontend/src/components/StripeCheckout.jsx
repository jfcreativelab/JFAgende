import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from './Button'
import Loading from './Loading'

// Chave pública do Stripe
const stripePromise = loadStripe('pk_live_51Rr8vwLNKzwkxa1hdKfYNjib2k1lYHY8FiqY0CNKdxWlbTATnsTrHWSVJ5pEhWJaJfCxzS7qzsDRD2fYwzY97RJ4001ZsDGu4s')

const CheckoutForm = ({ plano, estabelecimentoId, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Criar sessão de pagamento no backend
      const response = await fetch('/api/pagamento/criar-sessao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planoId: plano.id,
          estabelecimentoId: estabelecimentoId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de pagamento')
      }

      // Redirecionar para o Stripe Checkout
      window.location.href = data.url

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Resumo do Plano
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Plano:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {plano.nome}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Valor:</span>
            <span className="font-semibold text-primary-600">
              R$ {plano.preco.toFixed(2).replace('.', ',')}/mês
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cobrança:</span>
            <span className="text-gray-900 dark:text-white">Mensal</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || loading}
        >
          {loading ? (
            <Loading size="sm" />
          ) : (
            `Pagar R$ ${plano.preco.toFixed(2).replace('.', ',')}`
          )}
        </Button>
      </div>
    </form>
  )
}

const StripeCheckout = ({ plano, estabelecimentoId, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Para simplificar, vamos usar o Stripe Checkout em vez de Elements
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading size="lg" message="Carregando checkout..." />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        plano={plano}
        estabelecimentoId={estabelecimentoId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  )
}

export default StripeCheckout



















