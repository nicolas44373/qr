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
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setShowContactMenu(!showContactMenu)}
          className="bg-green-500 hover:bg-green-600 transition-all duration-200 p-3 rounded-full shadow-lg text-white flex items-center justify-center"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        {showContactMenu && (
          <div className="mt-2 bg-white rounded-lg shadow-lg py-2 w-48 text-center border border-green-300">
            <button
              onClick={() => handleWhatsAppContact('minorista')}
              className="block w-full py-2 px-4 hover:bg-green-100 transition-colors font-semibold text-green-700"
            >
              Contacto Minorista
            </button>
            <button
              onClick={() => handleWhatsAppContact('mayorista')}
              className="block w-full py-2 px-4 hover:bg-green-100 transition-colors font-semibold text-green-700"
            >
              Contacto Mayorista
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
