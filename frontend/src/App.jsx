import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

// Páginas
import Home from './pages/Home'
import LoginCliente from './pages/LoginCliente'
import LoginEstabelecimento from './pages/LoginEstabelecimento'
import CadastroCliente from './pages/CadastroCliente'
import CadastroEstabelecimento from './pages/CadastroEstabelecimento'
import DashboardCliente from './pages/DashboardCliente'
import DashboardEstabelecimento from './pages/DashboardEstabelecimento'
import EstabelecimentoDetalhes from './pages/EstabelecimentoDetalhes'
import Agendamento from './pages/Agendamento'
import PerfilCliente from './pages/PerfilCliente'
import HistoricoAgendamentos from './pages/HistoricoAgendamentos'
import RelatoriosEstabelecimento from './pages/RelatoriosEstabelecimento'
import PortfolioEstabelecimento from './pages/PortfolioEstabelecimento'
import PerfilEstabelecimento from './pages/PerfilEstabelecimento'
import GestaoEquipe from './pages/GestaoEquipe'
import PlanosPage from './pages/PlanosPage'
import AssinaturaEstabelecimento from './pages/AssinaturaEstabelecimento'
import LoginAdmin from './pages/LoginAdmin'
import DashboardAdmin from './pages/DashboardAdmin'
import GerenciarUsuarios from './pages/GerenciarUsuarios'
import GerenciarPlanos from './pages/GerenciarPlanos'
import LogsAuditoria from './pages/LogsAuditoria'
import GerenciarAdmins from './pages/GerenciarAdmins'
import ConfiguracoesAdmin from './pages/ConfiguracoesAdmin'
import WhatsAppAdmin from './pages/WhatsAppAdmin'
import RelatoriosAvancados from './pages/RelatoriosAvancados'
import Notificacoes from './pages/Notificacoes'
import PagamentoSucesso from './pages/PagamentoSucesso'
import PagamentoCancelado from './pages/PagamentoCancelado'

// Componente de rota protegida
function ProtectedRoute({ children, tipo }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (tipo && user.tipo !== tipo) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login/cliente" element={<LoginCliente />} />
          <Route path="/login/estabelecimento" element={<LoginEstabelecimento />} />
          <Route path="/cadastro/cliente" element={<CadastroCliente />} />
          <Route path="/cadastro/estabelecimento" element={<CadastroEstabelecimento />} />

          {/* Rotas protegidas - Cliente */}
          <Route
            path="/cliente/dashboard"
            element={
              <ProtectedRoute tipo="cliente">
                <DashboardCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/perfil"
            element={
              <ProtectedRoute tipo="cliente">
                <PerfilCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/historico"
            element={
              <ProtectedRoute tipo="cliente">
                <HistoricoAgendamentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/:id"
            element={
              <ProtectedRoute tipo="cliente">
                <EstabelecimentoDetalhes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamento/:estabelecimentoId/:servicoId"
            element={
              <ProtectedRoute tipo="cliente">
                <Agendamento />
              </ProtectedRoute>
            }
          />

          {/* Rotas protegidas - Estabelecimento */}
          <Route
            path="/estabelecimento/dashboard"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <DashboardEstabelecimento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/relatorios"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <RelatoriosEstabelecimento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/portfolio"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <PortfolioEstabelecimento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/perfil"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <PerfilEstabelecimento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/assinatura"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <AssinaturaEstabelecimento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/equipe"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <GestaoEquipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estabelecimento/whatsapp"
            element={
              <ProtectedRoute tipo="estabelecimento">
                <WhatsAppAdmin />
              </ProtectedRoute>
            }
          />

          {/* Rota pública de planos */}
          <Route path="/planos" element={<PlanosPage />} />

          {/* Rotas Admin */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute tipo="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/clientes" 
            element={
              <ProtectedRoute tipo="admin">
                <GerenciarUsuarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/estabelecimentos" 
            element={
              <ProtectedRoute tipo="admin">
                <GerenciarUsuarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/planos" 
            element={
              <ProtectedRoute tipo="admin">
                <GerenciarPlanos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/relatorios" 
            element={
              <ProtectedRoute tipo="admin">
                <RelatoriosAvancados />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <ProtectedRoute tipo="admin">
                <LogsAuditoria />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/admins" 
            element={
              <ProtectedRoute tipo="admin">
                <GerenciarAdmins />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/configuracoes" 
            element={
              <ProtectedRoute tipo="admin">
                <ConfiguracoesAdmin />
              </ProtectedRoute>
            } 
          />
          {/* Notificações (cliente/estabelecimento) */}
          <Route path="/notificacoes" element={<Notificacoes />} />

          {/* Páginas de Pagamento */}
          <Route path="/assinatura/sucesso" element={<PagamentoSucesso />} />
          <Route path="/assinatura/cancelado" element={<PagamentoCancelado />} />

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App

