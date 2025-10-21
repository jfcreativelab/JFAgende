import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Camera, Save, Edit2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clienteService from '../services/clienteService'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import UploadImagem from '../components/UploadImagem'

const PerfilCliente = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    fotoPerfil: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [toast, setToast] = useState(null)
  const [modalFotoAberto, setModalFotoAberto] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        fotoPerfil: user.fotoPerfil || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await clienteService.update(user.id, formData)
      updateUser(response.cliente)
      setToast({ type: 'success', message: 'Perfil atualizado com sucesso!' })
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erro ao atualizar perfil' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFoto = async (file) => {
    setLoadingUpload(true)
    
    try {
      // Simular upload (aqui você conectaria com sua API de upload)
      // Por enquanto, vamos converter para base64 para demonstração
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, fotoPerfil: reader.result })
        setModalFotoAberto(false)
        setToast({ type: 'success', message: 'Foto carregada! Clique em "Salvar Alterações" para confirmar.' })
        setLoadingUpload(false)
      }
      reader.readAsDataURL(file)
      
      // TODO: Implementar upload real para o servidor
      // const formData = new FormData()
      // formData.append('foto', file)
      // const response = await clienteService.uploadFoto(user.id, formData)
      // setFormData({ ...formData, fotoPerfil: response.url })
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao fazer upload da foto' })
      setLoadingUpload(false)
    }
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
          <Button
            variant="ghost"
            onClick={() => navigate('/cliente/dashboard')}
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Editar Perfil
          </h1>

          {/* Modal de Upload de Foto */}
          <Modal
            isOpen={modalFotoAberto}
            onClose={() => setModalFotoAberto(false)}
            title="Atualizar Foto de Perfil"
            maxWidth="md"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escolha uma foto que represente você! Ela será exibida em seus agendamentos.
              </p>
              
              <UploadImagem
                onUpload={handleUploadFoto}
                loading={loadingUpload}
                maxSize={5}
              />
            </div>
          </Modal>

          {/* Foto de Perfil */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              {formData.fotoPerfil ? (
                <img
                  src={formData.fotoPerfil}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900 transition-all group-hover:border-primary-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-primary-200 dark:border-primary-800 transition-all group-hover:border-primary-300">
                  <User className="text-primary-600 dark:text-primary-400" size={40} />
                </div>
              )}
              <button
                type="button"
                onClick={() => setModalFotoAberto(true)}
                className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-all shadow-lg hover:scale-110"
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {user?.nome}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalFotoAberto(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 size={14} />
                  Alterar foto
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                  Conta Ativa
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nome Completo"
              type="text"
              name="nome"
              icon={User}
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              value={user?.email}
              icon={Mail}
              disabled
              className="opacity-60 cursor-not-allowed"
            />

            <Input
              label="Telefone"
              type="tel"
              name="telefone"
              icon={Phone}
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/cliente/dashboard')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Informações da Conta
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Membro desde:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {new Date(user?.criadoEm).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tipo de conta:</span>
              <span className="text-gray-900 dark:text-white font-medium">Cliente</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PerfilCliente


