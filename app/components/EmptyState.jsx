// components/EmptyState.jsx
import React from 'react'
import { Search } from 'lucide-react'

const EmptyState = ({ onReset }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Search className="h-10 w-10 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600 mb-6">
          Intenta ajustar tu búsqueda o filtros para encontrar lo que necesitas.
        </p>
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Ver todos los productos
        </button>
      </div>
    </div>
  )
}

export default EmptyState
