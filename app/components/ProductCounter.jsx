// components/ProductCounter.jsx
import React from 'react'
import { Package } from 'lucide-react'

const ProductCounter = ({ count }) => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-200">
        <Package className="h-4 w-4 text-yellow-600 mr-2" />
        <span className="text-yellow-800 font-medium">
          {count} producto{count !== 1 ? 's' : ''} encontrado{count !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

export default ProductCounter