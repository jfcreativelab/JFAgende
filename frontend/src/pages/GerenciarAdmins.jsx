import { useState, useEffect } from 'react'
import { Plus, Search, Shield, ShieldCheck, ShieldX, Trash2, Edit, User, Mail, Calendar, Activity } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import adminService from '../services/adminService'

const GerenciarAdmins = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'ADMIN'
  })

  useEffect(() => {
    carregarAdmins()
  }, [])

  const carregarAdmins = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllAdmins()
      setAdmins(data)
    } catch (error) {
      console.error('Erro ao carregar admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    try {
      await adminService.createAdmin(formData.nome, formData.email, formData.senha, formData.role)
      setShowCreateModal(false)
      setFormData({ nome: '', email: '', senha: '', role: 'ADMIN' })
      carregarAdmins()
    } catch (error) {
      console.error('Erro ao criar admin:', error)
    }
  }

  const handleToggleStatus = async (admin) => {
    try {
      await adminService.toggleAdminStatus(admin.id)
      carregarAdmins()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDeleteAdmin = async () => {
    try {
      await adminService.deleteAdmin(selectedAdmin.id)
      setShowDeleteModal(false)
      setSelectedAdmin(null)
      carregarAdmins()
    } catch (error) {
      console.error('Erro ao deletar admin:', error)
    }
  }

  const filteredAdmins = admins.filter(admin =>
    admin.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role) => {
    const configs = {
      SUPER_ADMIN: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-800 dark:text-red-200',
        icon: ShieldCheck,
        label: 'Super Admin'
      },
      ADMIN: { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-800 dark:text-blue-200',
        icon: Shield,
        label: 'Admin'
      }
    }
    
    const config = configs[role] || configs.ADMIN
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (ativo) => {
    return ativo ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
        <ShieldCheck size={12} />
        Ativo
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
        <ShieldX size={12} />
        Inativo
      </span>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loading fullScreen />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Título */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gerenciar Administradores
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie os administradores do sistema
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Novo Admin
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAdmins.length} de {admins.length} administradores
            </div>
          </div>
        </Card>

        {/* Lista de Admins */}
        <div className="grid gap-4">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl">
                    <User size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {admin.nome}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {admin.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(admin.role)}
                      {getStatusBadge(admin.ativo)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      Criado em {new Date(admin.criadoEm).toLocaleDateString('pt-BR')}
                    </div>
                    {admin.ultimoAcesso && (
                      <div className="flex items-center gap-1 mt-1">
                        <Activity size={14} />
                        Último acesso: {new Date(admin.ultimoAcesso).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(admin)}
                      className={admin.ativo ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                    >
                      {admin.ativo ? <ShieldX size={16} /> : <ShieldCheck size={16} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setShowDeleteModal(true)
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal de Criação */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Criar Novo Administrador"
        >
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome
              </label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <Input
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Função
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Criar Admin
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Tem certeza que deseja excluir o administrador <strong>{selectedAdmin?.nome}</strong>?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteAdmin}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default GerenciarAdmins

