import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone, QrCode, Send, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import whatsappService from '../services/whatsappService'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Toast from '../components/Toast'

const WhatsAppAdmin = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)
  const [testMessage, setTestMessage] = useState({
    phoneNumber: '',
    message: 'Teste de mensagem do JFAgende'
  })
  const [sendingTest, setSendingTest] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      setLoading(true)
      const response = await whatsappService.getStatus()
      setStatus(response.data)
    } catch (error) {
      console.error('Erro ao carregar status:', error)
      setToast({ type: 'error', message: 'Erro ao carregar status do WhatsApp' })
    } finally {
      setLoading(false)
    }
  }

  const handleInitialize = async () => {
    try {
      setInitializing(true)
      await whatsappService.initialize()
      setToast({ type: 'success', message: 'WhatsApp inicializado! Aguarde o QR Code aparecer.' })
      // Recarregar status após inicialização
      setTimeout(() => {
        loadStatus()
      }, 2000)
    } catch (error) {
      console.error('Erro ao inicializar:', error)
      setToast({ type: 'error', message: 'Erro ao inicializar WhatsApp' })
    } finally {
      setInitializing(false)
    }
  }

  const handleSendTest = async () => {
    if (!testMessage.phoneNumber || !testMessage.message) {
      setToast({ type: 'error', message: 'Preencha o número e a mensagem' })
      return
    }

    try {
      setSendingTest(true)
      await whatsappService.sendTestMessage(testMessage.phoneNumber, testMessage.message)
      setToast({ type: 'success', message: 'Mensagem de teste enviada!' })
    } catch (error) {
      console.error('Erro ao enviar teste:', error)
      setToast({ type: 'error', message: 'Erro ao enviar mensagem de teste' })
    } finally {
      setSendingTest(false)
    }
  }

  const formatPhoneNumber = (phone) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '')
    
    // Formata para exibição
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/estabelecimento/dashboard')}
              >
                <ArrowLeft size={20} />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  WhatsApp Admin
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie mensagens automáticas
                </p>
              </div>
            </div>
            <Button
              onClick={loadStatus}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status do WhatsApp */}
        <Card className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Smartphone size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Status do WhatsApp
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Controle o envio de mensagens automáticas
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Atual */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Status Atual
              </h3>
              
              <div className="flex items-center gap-3">
                {status?.isReady ? (
                  <>
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Conectado e Pronto
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Desconectado
                    </span>
                  </>
                )}
              </div>

              {status?.hasQrCode && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode size={16} className="text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      QR Code Disponível
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Escaneie o QR Code no terminal do servidor para conectar
                  </p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Ações
              </h3>
              
              <div className="space-y-3">
                {!status?.isReady && (
                  <Button
                    onClick={handleInitialize}
                    disabled={initializing}
                    className="w-full"
                  >
                    {initializing ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Inicializando...
                      </>
                    ) : (
                      <>
                        <Smartphone size={16} />
                        Conectar WhatsApp
                      </>
                    )}
                  </Button>
                )}

                {status?.isReady && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        WhatsApp Conectado
                      </span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Mensagens automáticas estão ativas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Teste de Mensagem */}
        <Card className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Send size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Teste de Mensagem
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Envie uma mensagem de teste para verificar a conexão
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Telefone
              </label>
              <input
                type="text"
                value={testMessage.phoneNumber}
                onChange={(e) => setTestMessage({
                  ...testMessage,
                  phoneNumber: e.target.value
                })}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mensagem
              </label>
              <textarea
                value={testMessage.message}
                onChange={(e) => setTestMessage({
                  ...testMessage,
                  message: e.target.value
                })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <Button
              onClick={handleSendTest}
              disabled={sendingTest || !status?.isReady}
              className="w-full"
            >
              {sendingTest ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar Mensagem de Teste
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Informações */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <AlertCircle size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Como Funciona
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Entenda o sistema de mensagens automáticas
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Conectar WhatsApp</p>
                <p>Clique em "Conectar WhatsApp" e escaneie o QR Code que aparecerá no terminal do servidor</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Mensagens Automáticas</p>
                <p>Quando um cliente agendar um horário, uma mensagem de confirmação será enviada automaticamente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Teste</p>
                <p>Use a seção de teste para verificar se as mensagens estão sendo enviadas corretamente</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WhatsAppAdmin
