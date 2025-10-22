import { useState, useEffect } from 'react'
import { X, QrCode, Upload, CreditCard, AlertCircle, CheckCircle, Copy, DollarSign } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Card from './Card'
import Badge from './Badge'
import Toast from './Toast'
import Loading from './Loading'

const PagamentoPixModal = ({ 
  isOpen, 
  onClose, 
  agendamento, 
  estabelecimento,
  onConfirmarPagamento 
}) => {
  const [step, setStep] = useState(1) // 1: QR Code, 2: Upload comprovante
  const [comprovante, setComprovante] = useState(null)
  const [comprovantePreview, setComprovantePreview] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState(null)
  const [loadingQrCode, setLoadingQrCode] = useState(false)
  const [pixCopiado, setPixCopiado] = useState(false)

  const TAXA_PLATAFORMA = 5.00
  const valorServico = agendamento?.servico?.preco || 0
  const valorTotal = valorServico + TAXA_PLATAFORMA

  // Gerar QR Code quando o modal abrir
  useEffect(() => {
    if (isOpen && estabelecimento?.chavePix) {
      gerarQrCode()
    }
  }, [isOpen, estabelecimento?.chavePix])

  const gerarQrCode = async () => {
    if (!estabelecimento?.chavePix) return
    
    setLoadingQrCode(true)
    try {
      // Usar formato simples e funcional para PIX
      const QRCode = (await import('qrcode')).default
      
      // Formato simples que funciona com apps de pagamento
      const qrCodeData = `PIX:${estabelecimento.chavePix}|${valorTotal.toFixed(2)}|JFAgende|${agendamento.id}`
      
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeImage(qrCodeImage)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      setToast({ type: 'error', message: 'Erro ao gerar QR Code' })
    } finally {
      setLoadingQrCode(false)
    }
  }

  const copiarChavePix = () => {
    navigator.clipboard.writeText(estabelecimento?.chavePix || '')
    setPixCopiado(true)
    setTimeout(() => setPixCopiado(false), 2000)
    setToast({ type: 'info', message: 'Chave PIX copiada!' })
  }

  const handleComprovanteChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setToast({ type: 'error', message: 'Por favor, selecione apenas arquivos de imagem.' })
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ type: 'error', message: 'A imagem deve ter no máximo 5MB.' })
        return
      }

      setComprovante(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setComprovantePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEnviarComprovante = async () => {
    if (!comprovante) {
      setToast({ type: 'error', message: 'Por favor, selecione um comprovante.' })
      return
    }

    setLoading(true)
    try {
      console.log('🔍 Debug - Dados do agendamento:', agendamento)
      console.log('🔍 Debug - Estabelecimento:', estabelecimento)
      
      // Sempre criar um agendamento real para PIX
      const agendamentoData = {
        estabelecimentoId: estabelecimento.id,
        servicoId: agendamento.servico.id,
        dataHora: agendamento.dataHora,
        observacoes: 'Pagamento antecipado via PIX',
        pagamentoAntecipado: true,
        valorTaxa: 5.00,
        valorTotal: valorTotal
      }

      console.log('🔍 Debug - Dados para criar agendamento:', agendamentoData)

      const agendamentoResponse = await fetch('https://jfagende-production.up.railway.app/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(agendamentoData)
      })

      console.log('🔍 Debug - Response status:', agendamentoResponse.status)

      if (!agendamentoResponse.ok) {
        const errorData = await agendamentoResponse.json()
        console.error('🔍 Debug - Erro na resposta:', errorData)
        throw new Error(errorData.error || 'Erro ao criar agendamento.')
      }

      const novoAgendamento = await agendamentoResponse.json()
      console.log('🔍 Debug - Novo agendamento criado:', novoAgendamento)
      
      const agendamentoId = novoAgendamento.agendamento.id
      console.log('🔍 Debug - ID do agendamento:', agendamentoId)

      // Fazer upload do comprovante
      const formData = new FormData()
      formData.append('comprovante', comprovante)

      const uploadUrl = `https://jfagende-production.up.railway.app/api/pagamento/${agendamentoId}/comprovante`
      console.log('🔍 Debug - URL de upload:', uploadUrl)

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      console.log('🔍 Debug - Upload response status:', response.status)

      if (response.ok) {
        setToast({ type: 'success', message: 'Comprovante enviado com sucesso! Aguarde a confirmação.' })
        onClose()
        setStep(1)
        setComprovante(null)
        setComprovantePreview(null)
      } else {
        const errorData = await response.json()
        console.error('🔍 Debug - Erro no upload:', errorData)
        throw new Error(errorData.error || 'Erro ao enviar comprovante')
      }
    } catch (error) {
      console.error('Erro ao enviar comprovante:', error)
      setToast({ type: 'error', message: error.message || 'Erro ao enviar comprovante.' })
    } finally {
      setLoading(false)
    }
  }


  const copiarValor = () => {
    navigator.clipboard.writeText(valorTotal.toFixed(2))
    setToast({ type: 'success', message: 'Valor copiado!' })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pagamento PIX Antecipado"
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          {step === 1 && (
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          )}
          {step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              Voltar
            </Button>
          )}
          {step === 1 && (
            <Button onClick={() => setStep(2)}>
              Já Paguei - Enviar Comprovante
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleEnviarComprovante} disabled={loading || !comprovante}>
              {loading ? 'Enviando...' : 'Enviar Comprovante'}
            </Button>
          )}
        </div>
      }
    >
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast 
            type={toast.type} 
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          {/* Informações do Agendamento */}
          <Card className="p-4 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Detalhes do Agendamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Serviço:</span>
                <span className="font-medium text-gray-900 dark:text-white">{agendamento?.servico?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {agendamento?.dataHora ? new Date(agendamento.dataHora).toLocaleString('pt-BR') : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estabelecimento:</span>
                <span className="font-medium text-gray-900 dark:text-white">{estabelecimento?.nome}</span>
              </div>
            </div>
          </Card>

          {/* Valores */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <DollarSign size={20} />
              Valores
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Serviço:</span>
                <span className="font-medium text-gray-900 dark:text-white">R$ {valorServico.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Taxa da plataforma:</span>
                <span className="font-medium text-gray-900 dark:text-white">R$ {TAXA_PLATAFORMA.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Instruções PIX */}
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
              <AlertCircle size={20} />
              Instruções para Pagamento
            </h3>
            <div className="space-y-3 text-sm text-yellow-700 dark:text-yellow-300">
              <p>1. Abra seu app de pagamento PIX</p>
              <p>2. Escaneie o QR Code abaixo ou copie a chave PIX</p>
              <p>3. Digite o valor: <strong>R$ {valorTotal.toFixed(2)}</strong></p>
              <p>4. Confirme o pagamento</p>
              <p>5. Tire uma foto do comprovante e envie</p>
            </div>
          </Card>

          {/* QR Code e Chave PIX */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                {loadingQrCode ? (
                  <div className="flex flex-col items-center">
                    <Loading size="lg" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Gerando QR Code...</p>
                  </div>
                ) : qrCodeImage ? (
                  <div>
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">QR Code PIX</p>
                  </div>
                ) : (
                  <div>
                    <QrCode size={120} className="text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">QR Code não disponível</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Chave PIX:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={estabelecimento?.chavePix || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button
                  onClick={copiarChavePix}
                  size="sm"
                  variant="outline"
                  className="px-3"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`R$ ${valorTotal.toFixed(2)}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button
                  onClick={copiarValor}
                  size="sm"
                  variant="outline"
                  className="px-3"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Enviar Comprovante
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tire uma foto do comprovante do pagamento PIX e envie para confirmação.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comprovante PIX *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleComprovanteChange}
                className="hidden"
                id="comprovante-upload"
              />
              <label
                htmlFor="comprovante-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Clique para selecionar uma imagem
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG ou WEBP (máx. 5MB)
                </span>
              </label>
            </div>

            {comprovantePreview && (
              <div className="mt-4">
                <img
                  src={comprovantePreview}
                  alt="Preview do comprovante"
                  className="w-full max-w-md mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>

          <Card className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ⚠️ Importante
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Certifique-se de que o comprovante está legível</li>
              <li>• O valor deve ser exatamente R$ {valorTotal.toFixed(2)}</li>
              <li>• O pagamento será confirmado em até 24 horas</li>
              <li>• Você receberá uma notificação quando confirmado</li>
            </ul>
          </Card>
        </div>
      )}
    </Modal>
  )
}

export default PagamentoPixModal
