import Stripe from 'stripe'

// Verificar se a chave do Stripe está configurada
if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_51PleaseReplaceWithYourOwnTestKeyFromStripeDashboard') {
  console.error('⚠️  AVISO: Chave do Stripe não configurada!')
  console.error('📝 Configure suas chaves em backend/.env')
  console.error('🔗 Obtenha em: https://dashboard.stripe.com/test/apikeys')
  console.error('')
}

// Configuração do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_invalid_please_configure', {
  apiVersion: '2023-10-16',
})

export default stripe

// Chave pública para o frontend
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_invalid_please_configure'



