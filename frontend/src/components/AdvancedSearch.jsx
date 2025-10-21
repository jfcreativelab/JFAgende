import { useState, useEffect, useRef } from 'react'
import { Search, Filter, MapPin, Star, DollarSign, Clock, X, SlidersHorizontal } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import Card from './Card'

const AdvancedSearch = ({ onSearch, onFilterChange, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    categoria: '',
    precoMin: '',
    precoMax: '',
    avaliacao: '',
    distancia: '',
    disponibilidade: '',
    servicos: [],
    ...initialFilters
  })
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  const categorias = [
    { value: '', label: 'Todas as categorias' },
    { value: 'barbearia', label: 'Barbearia' },
    { value: 'salon', label: 'Salão de Beleza' },
    { value: 'spa', label: 'Spa' },
    { value: 'manicure', label: 'Manicure/Pedicure' },
    { value: 'depilacao', label: 'Depilação' },
    { value: 'estetica', label: 'Estética' },
    { value: 'bronze', label: 'Bronzeamento' },
    { value: 'ozonioterapia', label: 'Ozonioterapia' }
  ]

  const avaliacoes = [
    { value: '', label: 'Qualquer avaliação' },
    { value: '4', label: '⭐ 4+ estrelas' },
    { value: '4.5', label: '⭐ 4.5+ estrelas' },
    { value: '5', label: '⭐ 5 estrelas' }
  ]

  const distancias = [
    { value: '', label: 'Qualquer distância' },
    { value: '1', label: 'Até 1 km' },
    { value: '5', label: 'Até 5 km' },
    { value: '10', label: 'Até 10 km' },
    { value: '25', label: 'Até 25 km' }
  ]

  const disponibilidades = [
    { value: '', label: 'Qualquer horário' },
    { value: 'hoje', label: 'Hoje' },
    { value: 'amanha', label: 'Amanhã' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'fim_semana', label: 'Fim de semana' }
  ]

  // Simular sugestões de busca
  const mockSuggestions = [
    'Barbearia Moderna',
    'Salão Beleza Total',
    'Spa Relaxamento',
    'Clínica Estética',
    'Manicure Express'
  ]

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    const searchData = {
      term: searchTerm,
      filters
    }
    onSearch(searchData)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      categoria: '',
      precoMin: '',
      precoMax: '',
      avaliacao: '',
      distancia: '',
      disponibilidade: '',
      servicos: []
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    handleSearch()
  }

  return (
    <div className="w-full">
      {/* Barra de busca principal */}
      <div className="relative" ref={searchRef}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar estabelecimentos, serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(searchTerm.length > 2)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            
            {/* Sugestões */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="px-4"
          >
            <SlidersHorizontal size={20} />
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
          
          <Button onClick={handleSearch} className="px-6">
            <Search size={20} />
          </Button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <Card className="mt-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtros Avançados
            </h3>
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              <X size={16} className="mr-1" />
              Limpar filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <Select
                value={filters.categoria}
                onChange={(value) => handleFilterChange('categoria', value)}
                options={categorias}
                placeholder="Selecionar categoria"
              />
            </div>

            {/* Preço Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço Mínimo
              </label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={filters.precoMin}
                onChange={(e) => handleFilterChange('precoMin', e.target.value)}
                icon={DollarSign}
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço Máximo
              </label>
              <Input
                type="number"
                placeholder="R$ 500,00"
                value={filters.precoMax}
                onChange={(e) => handleFilterChange('precoMax', e.target.value)}
                icon={DollarSign}
              />
            </div>

            {/* Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avaliação Mínima
              </label>
              <Select
                value={filters.avaliacao}
                onChange={(value) => handleFilterChange('avaliacao', value)}
                options={avaliacoes}
                placeholder="Selecionar avaliação"
              />
            </div>

            {/* Distância */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distância
              </label>
              <Select
                value={filters.distancia}
                onChange={(value) => handleFilterChange('distancia', value)}
                options={distancias}
                placeholder="Selecionar distância"
                icon={MapPin}
              />
            </div>

            {/* Disponibilidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Disponibilidade
              </label>
              <Select
                value={filters.disponibilidade}
                onChange={(value) => handleFilterChange('disponibilidade', value)}
                options={disponibilidades}
                placeholder="Selecionar horário"
                icon={Clock}
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSearch}>
              Aplicar Filtros
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdvancedSearch
