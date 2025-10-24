import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de ícones válidos do Lucide React (apenas os mais comuns)
const iconesValidos = [
  'Shield', 'Lock', 'Unlock', 'Eye', 'EyeOff', 'AlertTriangle', 'CheckCircle', 'XCircle',
  'Activity', 'Users', 'Key', 'Fingerprint', 'Scan', 'QrCode', 'Database', 'Server',
  'Wifi', 'WifiOff', 'Globe', 'ShieldCheck', 'ShieldAlert', 'ShieldX', 'Clock',
  'RefreshCw', 'Settings', 'Filter', 'Search', 'Download', 'Upload', 'Plus', 'Minus',
  'Edit', 'Trash2', 'Save', 'X', 'Copy', 'ExternalLink', 'MoreVertical', 'ChevronLeft',
  'ChevronRight', 'ChevronUp', 'ChevronDown', 'ArrowUpRight', 'ArrowDownRight',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'User', 'Mail', 'Phone',
  'MapPin', 'Calendar', 'Clock', 'DollarSign', 'TrendingUp', 'TrendingDown',
  'BarChart3', 'PieChart', 'LineChart', 'FileText', 'Image', 'Video', 'Music',
  'Headphones', 'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'Desktop', 'Mouse',
  'Keyboard', 'Printer', 'Camera', 'Mic', 'Speaker', 'Volume2', 'VolumeX',
  'Play', 'Pause', 'Stop', 'SkipBack', 'SkipForward', 'Repeat', 'Shuffle',
  'Heart', 'Star', 'ThumbsUp', 'ThumbsDown', 'MessageCircle', 'MessageSquare',
  'Bell', 'BellOff', 'Bookmark', 'BookmarkCheck', 'Flag', 'Tag', 'Tags',
  'Folder', 'FolderOpen', 'File', 'FileText', 'Archive', 'Inbox', 'Send',
  'Mail', 'MailOpen', 'Reply', 'ReplyAll', 'Forward', 'Share', 'Share2',
  'Link', 'Link2', 'Unlink', 'ExternalLink', 'Maximize', 'Minimize', 'Maximize2',
  'Minimize2', 'Move', 'Move3D', 'RotateCcw', 'RotateCw', 'FlipHorizontal',
  'FlipVertical', 'Crop', 'Scissors', 'Palette', 'Brush', 'Eraser', 'Pen',
  'Pencil', 'Highlighter', 'Type', 'AlignLeft', 'AlignCenter', 'AlignRight',
  'AlignJustify', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Code',
  'Code2', 'Terminal', 'Command', 'Square', 'Circle', 'Triangle', 'Hexagon',
  'Octagon', 'Diamond', 'Zap', 'ZapOff', 'Sun', 'Moon', 'Sunrise', 'Sunset',
  'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning', 'Wind', 'Droplets',
  'Thermometer', 'Umbrella', 'Snowflake', 'Tornado', 'Hurricane', 'Earth',
  'Map', 'Navigation', 'Compass', 'Target', 'Crosshair', 'Focus', 'Aim',
  'Cross', 'Plus', 'Minus', 'Multiply', 'Divide', 'Equal', 'NotEqual',
  'GreaterThan', 'LessThan', 'GreaterThanOrEqual', 'LessThanOrEqual',
  'Percent', 'Hash', 'AtSign', 'Asterisk', 'Ampersand', 'DollarSign',
  'Euro', 'Pound', 'Yen', 'Won', 'Ruble', 'Rupee', 'Lira', 'Shekel',
  'Peso', 'Real', 'Dinar', 'Dirham', 'Rial', 'Taka', 'Tugrik', 'Kip',
  'Riel', 'Dong', 'Colon', 'Cordoba', 'Quetzal', 'Lempira', 'Balboa',
  'Guarani', 'Boliviano', 'Sucre', 'Sol', 'Inti', 'Cruzeiro', 'Cruzado',
  'MilReis', 'Conto', 'Escudo', 'Pataca', 'Macanese', 'HongKong', 'Taiwan',
  'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Vietnam',
  'Cambodia', 'Laos', 'Myanmar', 'Bangladesh', 'SriLanka', 'Nepal', 'Bhutan',
  'Maldives', 'Pakistan', 'Afghanistan', 'Iran', 'Iraq', 'Syria', 'Lebanon',
  'Jordan', 'Israel', 'Palestine', 'SaudiArabia', 'Kuwait', 'Bahrain', 'Qatar',
  'UAE', 'Oman', 'Yemen', 'Turkey', 'Cyprus', 'Greece', 'Bulgaria', 'Romania',
  'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland',
  'Sweden', 'Norway', 'Denmark', 'Iceland', 'Ireland', 'UK', 'France', 'Spain',
  'Portugal', 'Italy', 'Switzerland', 'Austria', 'Germany', 'Netherlands',
  'Belgium', 'Luxembourg', 'Poland', 'Czech', 'Slovakia', 'Hungary', 'Slovenia',
  'Croatia', 'Bosnia', 'Serbia', 'Montenegro', 'Macedonia', 'Albania', 'Kosovo',
  'Malta', 'Monaco', 'SanMarino', 'Vatican', 'Andorra', 'Liechtenstein',
  'Russia', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan',
  'Mongolia', 'China', 'Japan', 'Korea', 'NorthKorea', 'India', 'Brazil',
  'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia',
  'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'FrenchGuiana', 'Canada', 'USA',
  'Mexico', 'Guatemala', 'Belize', 'ElSalvador', 'Honduras', 'Nicaragua',
  'CostaRica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'DominicanRepublic',
  'PuertoRico', 'Trinidad', 'Barbados', 'SaintLucia', 'SaintVincent', 'Grenada',
  'Dominica', 'Antigua', 'SaintKitts', 'Nevis', 'Montserrat', 'Anguilla',
  'BritishVirginIslands', 'USVirginIslands', 'Turks', 'Caicos', 'Bahamas',
  'Bermuda', 'Greenland', 'SaintPierre', 'Miquelon', 'Australia', 'NewZealand',
  'Papua', 'NewGuinea', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon',
  'Islands', 'Kiribati', 'Tuvalu', 'Nauru', 'Palau', 'Marshall', 'Micronesia',
  'Cook', 'Niue', 'Tokelau', 'Pitcairn', 'Norfolk', 'Christmas', 'Cocos',
  'Heard', 'McDonald', 'Bouvet', 'SouthGeorgia', 'SouthSandwich', 'FrenchSouthern',
  'Antarctic', 'BritishAntarctic', 'AustralianAntarctic', 'NorwegianAntarctic',
  'ChileanAntarctic', 'ArgentineAntarctic', 'SouthAfricanAntarctic', 'IndianAntarctic',
  'JapaneseAntarctic', 'GermanAntarctic', 'ItalianAntarctic', 'PolishAntarctic',
  'BrazilianAntarctic', 'UruguayanAntarctic', 'PeruvianAntarctic', 'EcuadorianAntarctic',
  'ColombianAntarctic', 'VenezuelanAntarctic', 'BolivianAntarctic', 'ParaguayanAntarctic',
  'Bug', 'Info', 'HelpCircle', 'QuestionMarkCircle', 'AlertCircle', 'CheckCircle2',
  'XCircle2', 'PlusCircle', 'MinusCircle', 'XCircle2', 'CheckCircle2', 'AlertCircle',
  'Info', 'HelpCircle', 'QuestionMarkCircle', 'Bug', 'Zap', 'ZapOff', 'Sun',
  'Moon', 'Sunrise', 'Sunset', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning',
  'Wind', 'Droplets', 'Thermometer', 'Umbrella', 'Snowflake', 'Tornado', 'Hurricane',
  'Earth', 'Map', 'Navigation', 'Compass', 'Target', 'Crosshair', 'Focus', 'Aim',
  'Cross', 'Plus', 'Minus', 'Multiply', 'Divide', 'Equal', 'NotEqual', 'GreaterThan',
  'LessThan', 'GreaterThanOrEqual', 'LessThanOrEqual', 'Percent', 'Hash', 'AtSign',
  'Asterisk', 'Ampersand', 'DollarSign', 'Euro', 'Pound', 'Yen', 'Won', 'Ruble',
  'Rupee', 'Lira', 'Shekel', 'Peso', 'Real', 'Dinar', 'Dirham', 'Rial', 'Taka',
  'Tugrik', 'Kip', 'Riel', 'Dong', 'Colon', 'Cordoba', 'Quetzal', 'Lempira',
  'Balboa', 'Guarani', 'Boliviano', 'Sucre', 'Sol', 'Inti', 'Cruzeiro', 'Cruzado',
  'MilReis', 'Conto', 'Escudo', 'Pataca', 'Macanese', 'HongKong', 'Taiwan',
  'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Vietnam',
  'Cambodia', 'Laos', 'Myanmar', 'Bangladesh', 'SriLanka', 'Nepal', 'Bhutan',
  'Maldives', 'Pakistan', 'Afghanistan', 'Iran', 'Iraq', 'Syria', 'Lebanon',
  'Jordan', 'Israel', 'Palestine', 'SaudiArabia', 'Kuwait', 'Bahrain', 'Qatar',
  'UAE', 'Oman', 'Yemen', 'Turkey', 'Cyprus', 'Greece', 'Bulgaria', 'Romania',
  'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland',
  'Sweden', 'Norway', 'Denmark', 'Iceland', 'Ireland', 'UK', 'France', 'Spain',
  'Portugal', 'Italy', 'Switzerland', 'Austria', 'Germany', 'Netherlands',
  'Belgium', 'Luxembourg', 'Poland', 'Czech', 'Slovakia', 'Hungary', 'Slovenia',
  'Croatia', 'Bosnia', 'Serbia', 'Montenegro', 'Macedonia', 'Albania', 'Kosovo',
  'Malta', 'Monaco', 'SanMarino', 'Vatican', 'Andorra', 'Liechtenstein',
  'Russia', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan',
  'Mongolia', 'China', 'Japan', 'Korea', 'NorthKorea', 'India', 'Brazil',
  'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia',
  'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'FrenchGuiana', 'Canada', 'USA',
  'Mexico', 'Guatemala', 'Belize', 'ElSalvador', 'Honduras', 'Nicaragua',
  'CostaRica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'DominicanRepublic',
  'PuertoRico', 'Trinidad', 'Barbados', 'SaintLucia', 'SaintVincent', 'Grenada',
  'Dominica', 'Antigua', 'SaintKitts', 'Nevis', 'Montserrat', 'Anguilla',
  'BritishVirginIslands', 'USVirginIslands', 'Turks', 'Caicos', 'Bahamas',
  'Bermuda', 'Greenland', 'SaintPierre', 'Miquelon', 'Australia', 'NewZealand',
  'Papua', 'NewGuinea', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon',
  'Islands', 'Kiribati', 'Tuvalu', 'Nauru', 'Palau', 'Marshall', 'Micronesia',
  'Cook', 'Niue', 'Tokelau', 'Pitcairn', 'Norfolk', 'Christmas', 'Cocos',
  'Heard', 'McDonald', 'Bouvet', 'SouthGeorgia', 'SouthSandwich', 'FrenchSouthern',
  'Antarctic', 'BritishAntarctic', 'AustralianAntarctic', 'NorwegianAntarctic',
  'ChileanAntarctic', 'ArgentineAntarctic', 'SouthAfricanAntarctic', 'IndianAntarctic',
  'JapaneseAntarctic', 'GermanAntarctic', 'ItalianAntarctic', 'PolishAntarctic',
  'BrazilianAntarctic', 'UruguayanAntarctic', 'PeruvianAntarctic', 'EcuadorianAntarctic',
  'ColombianAntarctic', 'VenezuelanAntarctic', 'BolivianAntarctic', 'ParaguayanAntarctic'
];

// Arquivos para corrigir
const arquivos = [
  'src/pages/SegurancaAdmin.jsx',
  'src/pages/FinanceiroAdmin.jsx',
  'src/pages/MarketingAdmin.jsx',
  'src/pages/ApiManagementAdmin.jsx',
  'src/pages/ContentManagementAdmin.jsx',
  'src/pages/SupportAdmin.jsx',
  'src/pages/BackupAdmin.jsx'
];

function corrigirImports(arquivo) {
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
  
  console.log(`✅ Corrigido: ${arquivo}`);
  console.log(`   Imports originais: ${imports.length}`);
  console.log(`   Imports válidos: ${importsUnicos.length}`);
  console.log(`   Removidos: ${imports.length - importsUnicos.length}`);
}

// Corrigir todos os arquivos
console.log('🔧 Corrigindo imports inválidos do Lucide React...\n');

arquivos.forEach(arquivo => {
  try {
    corrigirImports(arquivo);
  } catch (error) {
    console.log(`❌ Erro ao corrigir ${arquivo}:`, error.message);
  }
});

console.log('\n🎉 Correção concluída!');
