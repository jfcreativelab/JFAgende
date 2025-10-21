import { useState, useEffect } from 'react'
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Globe, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Server,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Loading from '../components/Loading'

const ConfiguracoesAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações do Sistema
    nomeSistema: 'JFAgende',
    versao: '2.0.0',
    ambiente: 'production',
    
    // Configurações de Email
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFrom: 'noreply@jfagende.com',
    
    // Configurações de Notificações
    notificacoesEmail: true,
    notificacoesPush: true,
    lembreteAgendamento: 24, // horas antes
    
    // Configurações de Segurança
    maxTentativasLogin: 5,
    tempoBloqueio: 30, // minutos
    sessaoExpiracao: 24, // horas
    requisitosSenha: {
      minCaracteres: 8,
      requerMaiuscula: true,
      requerMinuscula: true,
      requerNumero: true,
      requerEspecial: true
    },
    
    // Configurações de Backup
    backupAutomatico: true,
    frequenciaBackup: 'daily', // daily, weekly, monthly
    manterBackups: 30, // dias
    
    // Configurações de Planos
    planoGratuitoLimite: 50, // agendamentos por mês
    planoBasicoPreco: 29.90,
    planoPremiumPreco: 59.90,
    
    // Configurações de API
    rateLimit: 1000, // requests por hora
    timeout: 30, // segundos
    corsOrigins: ['http://localhost:3000', 'https://jfagende.com']
  })

  const [activeTab, setActiveTab] = useState('sistema')

  const tabs = [
    { id: 'sistema', label: 'Sistema', icon: Server },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'planos', label: 'Planos', icon: DollarSign },
    { id: 'api', label: 'API', icon: Globe }
  ]

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Configurações salvas:', configuracoes)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    // Resetar para configurações padrão
    window.location.reload()
  }

  const renderSistemaTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome do Sistema
          </label>
          <Input
            value={configuracoes.nomeSistema}
            onChange={(e) => setConfiguracoes({ ...configuracoes, nomeSistema: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Versão
          </label>
          <Input
            value={configuracoes.versao}
            onChange={(e) => setConfiguracoes({ ...configuracoes, versao: e.target.value })}
            disabled
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ambiente
          </label>
          <select
            value={configuracoes.ambiente}
            onChange={(e) => setConfiguracoes({ ...configuracoes, ambiente: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Informações do Sistema</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              O sistema está rodando em modo {configuracoes.ambiente}. 
              Certifique-se de que as configurações estão adequadas para o ambiente de produção.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmailTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Host
          </label>
          <Input
            type="text"
            value={configuracoes.smtpHost}
            onChange={(e) => setConfiguracoes({ ...configuracoes, smtpHost: e.target.value })}
            placeholder="smtp.gmail.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Port
          </label>
          <Input
            type="number"
            value={configuracoes.smtpPort}
            onChange={(e) => setConfiguracoes({ ...configuracoes, smtpPort: parseInt(e.target.value) })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Username
          </label>
          <Input
            type="text"
            value={configuracoes.smtpUser}
            onChange={(e) => setConfiguracoes({ ...configuracoes, smtpUser: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Password
          </label>
          <Input
            type="password"
            value={configuracoes.smtpPassword}
            onChange={(e) => setConfiguracoes({ ...configuracoes, smtpPassword: e.target.value })}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email From
          </label>
          <Input
            type="email"
            value={configuracoes.emailFrom}
            onChange={(e) => setConfiguracoes({ ...configuracoes, emailFrom: e.target.value })}
          />
        </div>
      </div>
    </div>
  )

  const renderNotificacoesTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Notificações por Email</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enviar notificações por email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracoes.notificacoesEmail}
              onChange={(e) => setConfiguracoes({ ...configuracoes, notificacoesEmail: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Notificações Push</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enviar notificações push</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracoes.notificacoesPush}
              onChange={(e) => setConfiguracoes({ ...configuracoes, notificacoesPush: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lembrete de Agendamento (horas antes)
          </label>
          <Input
            type="number"
            value={configuracoes.lembreteAgendamento}
            onChange={(e) => setConfiguracoes({ ...configuracoes, lembreteAgendamento: parseInt(e.target.value) })}
            min="1"
            max="168"
          />
        </div>
      </div>
    </div>
  )

  const renderSegurancaTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Máximo de Tentativas de Login
          </label>
          <Input
            type="number"
            value={configuracoes.maxTentativasLogin}
            onChange={(e) => setConfiguracoes({ ...configuracoes, maxTentativasLogin: parseInt(e.target.value) })}
            min="1"
            max="10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tempo de Bloqueio (minutos)
          </label>
          <Input
            type="number"
            value={configuracoes.tempoBloqueio}
            onChange={(e) => setConfiguracoes({ ...configuracoes, tempoBloqueio: parseInt(e.target.value) })}
            min="1"
            max="1440"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expiração de Sessão (horas)
          </label>
          <Input
            type="number"
            value={configuracoes.sessaoExpiracao}
            onChange={(e) => setConfiguracoes({ ...configuracoes, sessaoExpiracao: parseInt(e.target.value) })}
            min="1"
            max="168"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Requisitos de Senha</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mínimo de Caracteres
          </label>
          <Input
            type="number"
            value={configuracoes.requisitosSenha.minCaracteres}
            onChange={(e) => setConfiguracoes({ 
              ...configuracoes, 
              requisitosSenha: { 
                ...configuracoes.requisitosSenha, 
                minCaracteres: parseInt(e.target.value) 
              } 
            })}
            min="6"
            max="32"
          />
        </div>
        
        <div className="space-y-3">
          {[
            { key: 'requerMaiuscula', label: 'Requer letra maiúscula' },
            { key: 'requerMinuscula', label: 'Requer letra minúscula' },
            { key: 'requerNumero', label: 'Requer número' },
            { key: 'requerEspecial', label: 'Requer caractere especial' }
          ].map((req) => (
            <div key={req.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{req.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.requisitosSenha[req.key]}
                  onChange={(e) => setConfiguracoes({ 
                    ...configuracoes, 
                    requisitosSenha: { 
                      ...configuracoes.requisitosSenha, 
                      [req.key]: e.target.checked 
                    } 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Backup Automático</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Realizar backup automático do banco de dados</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={configuracoes.backupAutomatico}
            onChange={(e) => setConfiguracoes({ ...configuracoes, backupAutomatico: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequência do Backup
          </label>
          <select
            value={configuracoes.frequenciaBackup}
            onChange={(e) => setConfiguracoes({ ...configuracoes, frequenciaBackup: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Manter Backups (dias)
          </label>
          <Input
            type="number"
            value={configuracoes.manterBackups}
            onChange={(e) => setConfiguracoes({ ...configuracoes, manterBackups: parseInt(e.target.value) })}
            min="1"
            max="365"
          />
        </div>
      </div>
    </div>
  )

  const renderPlanosTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Limite do Plano Gratuito (agendamentos/mês)
          </label>
          <Input
            type="number"
            value={configuracoes.planoGratuitoLimite}
            onChange={(e) => setConfiguracoes({ ...configuracoes, planoGratuitoLimite: parseInt(e.target.value) })}
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preço do Plano Básico (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            value={configuracoes.planoBasicoPreco}
            onChange={(e) => setConfiguracoes({ ...configuracoes, planoBasicoPreco: parseFloat(e.target.value) })}
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preço do Plano Premium (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            value={configuracoes.planoPremiumPreco}
            onChange={(e) => setConfiguracoes({ ...configuracoes, planoPremiumPreco: parseFloat(e.target.value) })}
            min="0"
          />
        </div>
      </div>
    </div>
  )

  const renderApiTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rate Limit (requests/hora)
          </label>
          <Input
            type="number"
            value={configuracoes.rateLimit}
            onChange={(e) => setConfiguracoes({ ...configuracoes, rateLimit: parseInt(e.target.value) })}
            min="100"
            max="10000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timeout (segundos)
          </label>
          <Input
            type="number"
            value={configuracoes.timeout}
            onChange={(e) => setConfiguracoes({ ...configuracoes, timeout: parseInt(e.target.value) })}
            min="5"
            max="300"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CORS Origins (um por linha)
        </label>
        <textarea
          value={configuracoes.corsOrigins.join('\n')}
          onChange={(e) => setConfiguracoes({ 
            ...configuracoes, 
            corsOrigins: e.target.value.split('\n').filter(origin => origin.trim()) 
          })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="http://localhost:3000&#10;https://jfagende.com"
        />
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sistema': return renderSistemaTab()
      case 'email': return renderEmailTab()
      case 'notificacoes': return renderNotificacoesTab()
      case 'seguranca': return renderSegurancaTab()
      case 'backup': return renderBackupTab()
      case 'planos': return renderPlanosTab()
      case 'api': return renderApiTab()
      default: return renderSistemaTab()
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configurações do Sistema
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as configurações gerais do sistema
          </p>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </Card>

        {/* Conteúdo da Tab */}
        <Card>
          {renderTabContent()}
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
          >
            <RefreshCw size={16} className="mr-2" />
            Resetar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {saving ? (
              <>
                <Loading size={16} className="mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ConfiguracoesAdmin

