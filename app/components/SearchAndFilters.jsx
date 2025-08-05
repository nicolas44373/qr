// components/SearchAndFilters.jsx
import React from 'react'
import { Search, Filter } from 'lucide-react'

const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  categories = []
}) => {

  const mayorCategories = ['Rebozados', 'Cajones', 'Pescados', 'Ofertas']

  // Solo mostrar categorías de mayor
  const filteredCategories = categories.filter(cat => mayorCategories.includes(cat.name))

  const isRebozadosCategory =
    categories.find(c => c.id.toString() === selectedCategory)?.name === 'Rebozados'

  return (
    <div className="mb-12 space-y-6 max-w-4xl mx-auto">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar productos en nuestro catálogo por mayor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-base sm:text-lg shadow-md"
        />
      </div>

      {/* Filtro de Categorías */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:space-x-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-50 snap-x snap-mandatory px-2">
        <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-200 flex-shrink-0 snap-start">
          <Filter className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-700 font-medium text-sm">
            Categorías por Mayor:
          </span>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('all')
            setSelectedSubCategory('all')
          }}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md flex-shrink-0 snap-start ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg scale-105'
              : 'bg-white/80 text-gray-700 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400'
          }`}
        >
          Todos los productos
        </button>

        {filteredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id.toString())
              setSelectedSubCategory('all')
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md flex-shrink-0 snap-start ${
              selectedCategory === category.id.toString()
                ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg scale-105'
                : 'bg-white/80 text-gray-700 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Info adicional */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
          📦 Catálogo de productos por mayor - Precios por caja/unidad
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilters