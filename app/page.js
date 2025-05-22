'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, ShoppingBag, Package, MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showContactMenu, setShowContactMenu] = useState(false)

  const formatPrice = (price) => {
    if (!price) return '-'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.categoryId.toString() === selectedCategory
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          category_id,
          price,
          unit,
          price_per_kg,
          category:categories ( name )
        `)

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')

      if (productsError || categoriesError) {
        console.error('Error al cargar datos:', productsError || categoriesError)
      } else {
        const productsWithCategory = productsData.map((p) => ({
          ...p,
          category: p.category?.name || 'Sin categoría',
          categoryId: p.category_id,
          pricePerKg: p.price_per_kg
        }))

        setProducts(productsWithCategory)
        setCategories(categoriesData)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleWhatsAppContact = (type) => {
    const phoneMinorista = '+5494816516018'
    const phoneMayorista = '+5494812224766'
    
    const phone = type === 'minorista' ? phoneMinorista : phoneMayorista
    const message = `Hola! Me interesa obtener información sobre sus productos para ${type}.`
    
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowContactMenu(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-600 font-medium">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
      {/* Header */}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 py-8 sm:py-10">
        {/* Barra de búsqueda y filtros */}
        <div className="mb-10 space-y-6 max-w-3xl mx-auto">
          {/* Búsqueda */}
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

          {/* Filtros de categoría */}
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:space-x-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-50 snap-x snap-mandatory px-2">
  <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-200 flex-shrink-0 snap-start">
    <Filter className="h-4 w-4 text-yellow-600 flex-shrink-0" />
    <span className="text-yellow-700 font-medium text-sm">Filtrar:</span>
  </div>

  <button
    onClick={() => setSelectedCategory('all')}
    className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md flex-shrink-0 snap-start ${
      selectedCategory === 'all'
        ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg scale-105'
        : 'bg-white/80 text-gray-700 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400'
    }`}
  >
    Todos los productos
  </button>

  {categories.map((category) => (
    <button
      key={category.id}
      onClick={() => setSelectedCategory(category.id.toString())}
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

        </div>

        {/* Lista de productos */}
        {filteredProducts.map((product, index) => (
  <div
    key={product.id}
    className={`px-4 py-5 transition-colors duration-200 ${
      index % 2 === 0 ? 'bg-yellow-50/60' : 'bg-yellow-50/40'
    } border-b border-yellow-100`}
  >
    {/* Vista mobile */}
    <div className="md:hidden space-y-2">
      <div className="flex items-center text-yellow-800 font-semibold text-lg">
        <Package className="h-5 w-5 text-yellow-600 mr-2" />
        {product.name}
      </div>
      <div className="text-sm text-yellow-700 font-medium">
        Categoría: <span className="font-semibold">{product.category}</span>
      </div>
      <div className="text-sm text-yellow-700 font-medium">
        Precio por caja: <span className="font-semibold">{formatPrice(product.price)}</span>
      </div>
      <div className="text-sm text-yellow-700 font-medium">
        Precio: <span className="font-semibold">{formatPrice(product.pricePerKg)}</span>
      </div>
    </div>

    {/* Vista desktop */}
    <div className="hidden md:grid grid-cols-4 gap-4">
      <div className="flex items-center space-x-2">
        <Package className="h-5 w-5 text-yellow-600" />
        <span className="text-lg font-semibold text-yellow-800">{product.name}</span>
      </div>
      <div className="text-center text-yellow-700 font-medium">{product.category}</div>
      <div className="text-center text-yellow-700 font-semibold">{formatPrice(product.price)}</div>
      <div className="text-center text-yellow-700 font-semibold">{formatPrice(product.pricePerKg)}</div>
    </div>
  </div>
))}

      </main>

      {/* Botón flotante para contacto WhatsApp */}
      {/* Botón flotante para contacto WhatsApp */}
<div className="fixed bottom-6 right-6 z-30">
  {/* Floating Action Button with Epic Animations */}
  <div className="relative">
    {/* Pulsing Ring Animation */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-ping opacity-75"></div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse opacity-50 scale-110"></div>
    
    {/* Main Button */}
    <button
      onClick={() => setShowContactMenu(!showContactMenu)}
      className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 
                 transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out
                 p-4 rounded-full shadow-2xl text-white flex items-center justify-center
                 border-4 border-white/20 backdrop-blur-sm animate-bounce-gentle
                 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
      aria-label="Contactar por WhatsApp"
    >
      {/* Rotating Background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 animate-spin-slow"></div>
      
      {/* Icon with Animation */}
      <MessageCircle className={`h-7 w-7 relative z-10 transition-transform duration-300 ${showContactMenu ? 'rotate-12 scale-110' : ''}`} />
      
      {/* Floating Particles Effect */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
    </button>
  </div>

  {/* Epic Menu with Glassmorphism */}
  {showContactMenu && (
    <div className="mt-4 relative">
      {/* Backdrop Blur Effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>
      
      {/* Menu Container */}
      <div className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden w-56 transform animate-in slide-in-from-bottom-5 duration-300">
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 opacity-20 animate-pulse"></div>
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 text-center">
          <h3 className="text-white font-bold text-sm flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4 animate-pulse" />
            ¡Contáctanos Ahora!
          </h3>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <button
            onClick={() => handleWhatsAppContact('minorista')}
            className="group relative w-full py-3 px-4 rounded-xl overflow-hidden
                       bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100
                       border border-green-200/50 hover:border-green-300
                       transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                       text-green-800 font-semibold"
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <div className="relative flex items-center justify-between">
              <span>🛍️ Contacto Minorista</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </button>

          <button
            onClick={() => handleWhatsAppContact('mayorista')}
            className="group relative w-full py-3 px-4 rounded-xl overflow-hidden
                       bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100
                       border border-blue-200/50 hover:border-blue-300
                       transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                       text-blue-800 font-semibold"
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <div className="relative flex items-center justify-between">
              <span>🏢 Contacto Mayorista</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </button>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 text-center border-t border-gray-200/50">
          <p className="text-xs text-gray-600 font-medium">
            ✨ Respuesta inmediata garantizada
          </p>
        </div>
      </div>
    </div>
  )}
</div>
    </div>
  )
}
