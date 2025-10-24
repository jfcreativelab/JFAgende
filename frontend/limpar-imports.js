import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de ícones VÁLIDOS do Lucide React (apenas os básicos)
const iconesValidos = [
  'Shield', 'Lock', 'Unlock', 'Eye', 'EyeOff', 'AlertTriangle', 'CheckCircle', 'XCircle',
  'Activity', 'Users', 'Key', 'Fingerprint', 'Scan', 'QrCode', 'Database', 'Server',
  'Wifi', 'WifiOff', 'Globe', 'ShieldCheck', 'ShieldAlert', 'ShieldX', 'Clock',
  'RefreshCw', 'Settings', 'Filter', 'Search', 'Download', 'Upload', 'Plus', 'Minus',
  'Edit', 'Trash2', 'Save', 'X', 'Copy', 'ExternalLink', 'MoreVertical', 'ChevronLeft',
  'ChevronRight', 'ChevronUp', 'ChevronDown', 'ArrowUpRight', 'ArrowDownRight',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'User', 'Mail', 'Phone',
  'MapPin', 'Calendar', 'DollarSign', 'TrendingUp', 'TrendingDown', 'BarChart3',
  'PieChart', 'LineChart', 'FileText', 'Image', 'Video', 'Music', 'Headphones',
  'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'Desktop', 'Mouse', 'Keyboard',
  'Printer', 'Camera', 'Mic', 'Speaker', 'Volume2', 'VolumeX', 'Play', 'Pause',
  'SkipBack', 'SkipForward', 'Repeat', 'Shuffle', 'Heart', 'Star', 'ThumbsUp',
  'ThumbsDown', 'MessageCircle', 'MessageSquare', 'Bell', 'BellOff', 'Bookmark',
  'BookmarkCheck', 'Flag', 'Tag', 'Tags', 'Folder', 'FolderOpen', 'File', 'Archive',
  'Inbox', 'Send', 'MailOpen', 'Reply', 'ReplyAll', 'Forward', 'Share', 'Share2',
  'Link', 'Link2', 'Unlink', 'Maximize', 'Minimize', 'Maximize2', 'Minimize2',
  'Move', 'Move3D', 'RotateCcw', 'RotateCw', 'FlipHorizontal', 'FlipVertical',
  'Crop', 'Scissors', 'Palette', 'Brush', 'Eraser', 'Pen', 'Pencil', 'Highlighter',
  'Type', 'AlignLeft', 'AlignCenter', 'AlignRight', 'AlignJustify', 'Bold', 'Italic',
  'Underline', 'Strikethrough', 'Code', 'Code2', 'Terminal', 'Command', 'Square',
  'Circle', 'Triangle', 'Hexagon', 'Octagon', 'Diamond', 'Zap', 'ZapOff', 'Sun',
  'Moon', 'Sunrise', 'Sunset', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning',
  'Wind', 'Droplets', 'Thermometer', 'Umbrella', 'Snowflake', 'Tornado', 'Hurricane',
  'Earth', 'Map', 'Navigation', 'Compass', 'Target', 'Crosshair', 'Focus', 'Aim',
  'Cross', 'Equal', 'NotEqual', 'GreaterThan', 'LessThan', 'GreaterThanOrEqual',
  'LessThanOrEqual', 'Percent', 'Hash', 'AtSign', 'Asterisk', 'Ampersand', 'Euro',
  'Bug', 'Info', 'HelpCircle', 'QuestionMarkCircle', 'AlertCircle', 'CheckCircle2',
  'XCircle2', 'PlusCircle', 'MinusCircle'
];

// Arquivos para corrigir
const arquivos = [
  'src/pages/SegurancaAdmin.jsx',
  'src/pages/FinanceiroAdmin.jsx',
  'src/pages/MarketingAdmin.jsx',
  'src/pages/ApiManagementAdmin.jsx',
  'src/pages/ContentManagementAdmin.jsx',
  'src/pages/SupportAdmin.jsx',
  'src/pages/BackupAdmin.jsx',
  'src/pages/AnalyticsAdmin.jsx',
  'src/pages/NotificacoesAdmin.jsx',
  'src/pages/MonitoramentoAdmin.jsx'
];

function limparImports(arquivo) {
  const caminho = path.join(__dirname, arquivo);
  
  if (!fs.existsSync(caminho)) {
    console.log(`❌ Arquivo não encontrado: ${arquivo}`);
    return;
  }

  let conteudo = fs.readFileSync(caminho, 'utf8');
  
  // Encontrar a seção de imports do Lucide React
  const importMatch = conteudo.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/);
  
  if (!importMatch) {
    console.log(`❌ Imports do Lucide React não encontrados em: ${arquivo}`);
    return;
  }

  // Extrair todos os imports
  const imports = importMatch[1]
    .split(',')
    .map(imp => imp.trim())
    .filter(imp => imp.length > 0);

  // Filtrar apenas os imports válidos
  const importsValidos = imports.filter(imp => iconesValidos.includes(imp));
  
  // Remover duplicatas
  const importsUnicos = [...new Set(importsValidos)];
  
  // Criar novo import
  const novoImport = `import { 
  ${importsUnicos.join(',\n  ')}
} from 'lucide-react'`;
  
  // Substituir no conteúdo
  conteudo = conteudo.replace(importMatch[0], novoImport);
  
  // Salvar arquivo
  fs.writeFileSync(caminho, conteudo, 'utf8');
  
  console.log(`✅ Limpo: ${arquivo}`);
  console.log(`   Imports originais: ${imports.length}`);
  console.log(`   Imports válidos: ${importsUnicos.length}`);
  console.log(`   Removidos: ${imports.length - importsUnicos.length}`);
}

// Limpar todos os arquivos
console.log('🧹 Limpando imports inválidos do Lucide React...\n');

arquivos.forEach(arquivo => {
  try {
    limparImports(arquivo);
  } catch (error) {
    console.log(`❌ Erro ao limpar ${arquivo}:`, error.message);
  }
});

console.log('\n🎉 Limpeza concluída!');
