import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import Button from './Button'
import Card from './Card'
import Badge from './Badge'

const AdminTable = ({
  title,
  data = [],
  columns = [],
  searchable = true,
  filterable = true,
  actions = true,
  pagination = true,
  pageSize = 10,
  onEdit,
  onDelete,
  onView,
  onExport,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedItems, setSelectedItems] = useState([])

  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = sortedData.slice(startIndex, endIndex)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(currentData.map(item => item.id))
    }
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'Ativo' },
      inactive: { color: 'gray', text: 'Inativo' },
      pending: { color: 'yellow', text: 'Pendente' },
      approved: { color: 'green', text: 'Aprovado' },
      rejected: { color: 'red', text: 'Rejeitado' },
      completed: { color: 'blue', text: 'Concluído' },
      cancelled: { color: 'red', text: 'Cancelado' }
    }

    const config = statusConfig[status] || { color: 'gray', text: status }
    
    return (
      <Badge 
        className={`text-${config.color}-600 bg-${config.color}-100 dark:text-${config.color}-400 dark:bg-${config.color}-900/20`}
        size="sm"
      >
        {config.text}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button
                onClick={onExport}
                variant="outline"
                size="sm"
              >
                <Download size={16} />
                Exportar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
            >
              <Filter size={16} />
              Filtros
            </Button>
          </div>
        </div>

        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {actions && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentData.length && currentData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortField === column.key && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((item, index) => (
              <tr 
                key={item.id || index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                {actions && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.key === 'status' ? (
                      getStatusBadge(item[column.key])
                    ) : column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item[column.key]}
                      </span>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onView && (
                        <Button
                          onClick={() => onView(item)}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          onClick={() => onEdit(item)}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          onClick={() => onDelete(item)}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} resultados
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Página {currentPage} de {totalPages}
              </span>
              
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default AdminTable
