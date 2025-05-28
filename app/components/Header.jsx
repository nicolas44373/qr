// components/Header.jsx
import React from 'react'
import { ShoppingBag } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-20 border-b-2 border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 py-5 flex items-center space-x-4">
        <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-3 rounded-xl shadow-md">
          <ShoppingBag className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Alenort
          </h1>
          <p className="text-sm text-gray-600 font-medium">Catálogo de Productos</p>
        </div>
      </div>
    </header>
  )
}

export default Header