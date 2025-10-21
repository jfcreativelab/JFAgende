# JFAgende - Frontend

Interface moderna e responsiva do sistema de agendamento JFAgende.

## 🚀 Tecnologias

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API
- Lucide React (ícones)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🎨 Estrutura de Componentes

### Componentes Reutilizáveis

- **Button**: Botões com variantes (primary, secondary, outline, danger, ghost)
- **Input**: Campos de entrada com suporte a ícones e validação
- **Card**: Cards para exibição de conteúdo
- **Select**: Seleção dropdown customizado
- **Modal**: Modais responsivos
- **Badge**: Tags de status
- **Toast**: Notificações temporárias
- **Loading**: Indicadores de carregamento

### Páginas

- **Home**: Tela inicial com escolha de tipo de usuário
- **LoginCliente**: Login para clientes
- **LoginEstabelecimento**: Login para estabelecimentos
- **CadastroCliente**: Cadastro de novo cliente
- **CadastroEstabelecimento**: Cadastro de novo estabelecimento
- **DashboardCliente**: Dashboard do cliente com listagem de estabelecimentos
- **DashboardEstabelecimento**: Dashboard do estabelecimento com gestão
- **EstabelecimentoDetalhes**: Detalhes e serviços do estabelecimento
- **Agendamento**: Fluxo de criação de agendamento

## 🔐 Autenticação

O sistema usa Context API para gerenciar o estado de autenticação:

```jsx
import { useAuth } from './context/AuthContext'

function MeuComponente() {
  const { user, login, logout } = useAuth()
  // ...
}
```

## 🌐 Configuração da API

Por padrão, a API está configurada para `http://localhost:5000/api`.

Para alterar, crie um arquivo `.env`:

```env
VITE_API_URL=http://sua-api.com/api
```

## 🎨 Customização do Tema

As cores e estilos podem ser customizados em `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        // ...
      }
    }
  }
}
```

## 📱 Responsividade

Todos os componentes e páginas são totalmente responsivos, utilizando as classes utilitárias do Tailwind:

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📂 Estrutura de Pastas

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   ├── context/        # Contextos (Auth, etc)
│   ├── App.jsx         # Componente raiz
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globais
└── package.json
```

## 🚀 Deploy

### Vercel / Netlify

1. Conecte seu repositório
2. Configure o comando de build: `npm run build`
3. Configure o diretório de output: `dist`
4. Adicione as variáveis de ambiente necessárias

### Build Manual

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 🎯 Boas Práticas

- Componentes são funcionais com hooks
- Usa Context API para estado global
- Separação de responsabilidades (services, components, pages)
- Código limpo e comentado
- Componentes reutilizáveis e modulares
- Design responsivo mobile-first

## 📝 Notas

- O proxy para a API está configurado em `vite.config.js`
- Todas as requisições para `/api` são redirecionadas para `http://localhost:5000`
- Tokens JWT são armazenados no localStorage
- Logout automático quando o token expira

