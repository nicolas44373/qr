// components/SearchAndFilters.jsx
import React from 'react'
import { Search, Filter } from 'lucide-react'

const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedSaleType,
  setSelectedSaleType,
  selectedSubCategory,
  setSelectedSubCategory,
  categories = [],
  subCategories = []
}) => {

  const mayorCategories = ['Rebozados', 'Cajones', 'Pescados', 'Ofertas']

  const getFilteredCategories = () => {
    if (selectedSaleType === 'mayor') {
      return categories.filter(cat => mayorCategories.includes(cat.name))
    }
    return categories
  }

  const filteredCategories = getFilteredCategories()

  const isRebozadosMayor =
    selectedSaleType === 'mayor' &&
    categories.find(c => c.id.toString() === selectedCategory)?.name === 'Rebozados'

  return (
    <div className="mb-12 space-y-6 max-w-4xl mx-auto">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar productos en nuestro catálogo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-base sm:text-lg shadow-md"
        />
      </div>

      {/* Tipo de Venta */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setSelectedSaleType('mayor')
            setSelectedCategory('all')
            setSelectedSubCategory('')
          }}
          className={`px-8 py-3 rounded-2xl text-base font-bold transition-all duration-300 shadow-lg ${
            selectedSaleType === 'mayor'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200 scale-105'
              : 'bg-white/90 text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
          }`}
        >
          🏢 Por Mayor
          <div className="text-xs font-normal opacity-80 mt-1">
            (Precio por caja/unidad)
          </div>
        </button>

        <button
          onClick={() => {
            setSelectedSaleType('menor')
            setSelectedCategory('all')
            setSelectedSubCategory('')
          }}
          className={`px-8 py-3 rounded-2xl text-base font-bold transition-all duration-300 shadow-lg ${
            selectedSaleType === 'menor'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200 scale-105'
              : 'bg-white/90 text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-400'
          }`}
        >
          🛒 Por Menor
          <div className="text-xs font-normal opacity-80 mt-1">
            (Precio por kg)
          </div>
        </button>
      </div>

      {/* Filtro de Categorías */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:space-x-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-50 snap-x snap-mandatory px-2">
        <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-200 flex-shrink-0 snap-start">
          <Filter className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-700 font-medium text-sm">
            Categorías {selectedSaleType === 'mayor' ? 'por Mayor' : 'por Menor'}:
          </span>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('all')
            setSelectedSubCategory('')
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
              setSelectedSubCategory('')
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

      {/* Subcategorías (Marcas de Rebozados) */}
      {isRebozadosMayor && (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {Array.isArray(subCategories) && subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all shadow ${
                selectedSubCategory === sub
                  ? 'bg-yellow-500 text-white scale-105'
                  : 'bg-white text-gray-700 border border-yellow-300 hover:bg-yellow-100'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Info adicional */}
      <div className="text-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          selectedSaleType === 'mayor' 
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {selectedSaleType === 'mayor' ? (
            <>📦 Mostrando precios por caja/unidad - Venta al por mayor</>
          ) : (
            <>⚖️ Mostrando precios por kilogramo - Venta al por menor</>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilters
