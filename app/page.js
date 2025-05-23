'use client'

import React, { useState, useEffect } from 'react'
import { Search, ShoppingBag, Package, MessageCircle, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'

const EpicChickLoading = () => {
  const [particles, setParticles] = useState([])

  // Generate particles on client side only
  useEffect(() => {
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 2 + Math.random() * 2
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 relative overflow-hidden">
      {/* Partículas de fondo flotantes */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>

      {/* Container principal */}
      <div className="text-center z-10 relative">
        {/* Pollito animado */}
        <div className="relative mb-8">
          {/* Cuerpo del pollito */}
          <div className="relative inline-block animate-bounce">
            {/* Cuerpo principal */}
            <div className="w-24 h-20 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full relative transform hover:scale-110 transition-transform duration-300">
              {/* Pico */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-400 animate-pulse"></div>
              </div>
              
              {/* Ojos */}
              <div className="absolute top-4 left-6 w-3 h-3 bg-black rounded-full animate-blink"></div>
              <div className="absolute top-4 right-6 w-3 h-3 bg-black rounded-full animate-blink"></div>
              
              {/* Mejillas rosadas */}
              <div className="absolute top-8 left-2 w-4 h-3 bg-pink-300 rounded-full opacity-60"></div>
              <div className="absolute top-8 right-2 w-4 h-3 bg-pink-300 rounded-full opacity-60"></div>
            </div>
            
            {/* Alas */}
            <div className="absolute top-2 -left-3 w-8 h-6 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full transform rotate-12 animate-flap origin-right"></div>
            <div className="absolute top-2 -right-3 w-8 h-6 bg-gradient-to-bl from-yellow-200 to-yellow-300 rounded-full transform -rotate-12 animate-flap origin-left"></div>
            
            {/* Patitas */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-4 bg-orange-400 rounded-sm animate-wiggle"></div>
              <div className="w-2 h-4 bg-orange-400 rounded-sm animate-wiggle" style={{animationDelay: '0.1s'}}></div>
            </div>
          </div>
          
          {/* Efectos de brillo */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full animate-shimmer"></div>
        </div>

        {/* Texto con efectos */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
            ¡Cargando catálogo!
          </h2>
          
          {/* Barra de progreso animada */}
          <div className="w-64 h-3 bg-yellow-200 rounded-full mx-auto overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full animate-progress shadow-lg"></div>
          </div>
          
          <p className="text-yellow-700 font-medium animate-fade-in-out">
            Preparando los mejores productos para ti...
          </p>
          
          {/* Huevos decorativos saltarines */}
          <div className="flex justify-center space-x-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-5 bg-gradient-to-b from-white to-gray-100 rounded-full border-2 border-yellow-300 animate-bounce shadow-lg"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 1; }
          40% { opacity: 0; }
        }
        
        @keyframes flap {
          0%, 100% { transform: rotate(12deg) translateY(0px); }
          50% { transform: rotate(25deg) translateY(-2px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { opacity: 0.2; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .animate-blink {
          animation: blink 2s infinite;
        }
        
        .animate-flap {
          animation: flap 0.8s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1.5s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

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
  const fetchData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Esperar 3 segundos

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
      setLoading(false)
    }
  }

  fetchData()
  
}, [])
useEffect(() => {
  filterProducts()
}, [searchTerm, selectedCategory, products])


  const handleWhatsAppContact = (type) => {
    const phoneMinorista = '+5493816516018'
    const phoneMayorista = '+5493812224766'
    
    const phone = type === 'minorista' ? phoneMinorista : phoneMayorista
    const message = `Hola! Me interesa obtener información sobre sus productos para ${type}.`
    
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowContactMenu(false)
  }

  if (loading) {
    return <EpicChickLoading />
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
        {/* Búsqueda y Filtros */}
        <div className="mb-12 space-y-6 max-w-3xl mx-auto">
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

        {/* Contador de productos */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-200">
            <Package className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 hover:border-yellow-300 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-transparent to-amber-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Category badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  {product.category}
                </div>
              </div>

              <div className="relative p-6 space-y-4">
                {/* Product header */}
                <div className="flex items-start space-x-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Package className="h-7 w-7 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-800 transition-colors duration-200 leading-tight">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Price section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100">
                    <div className="text-center flex-1">
                      <p className="text-xs font-medium text-yellow-700 uppercase tracking-wide mb-1">Precio por Caja</p>
                      <p className="text-2xl font-bold text-yellow-800">{formatPrice(product.price)}</p>
                    </div>
                    <div className="w-px h-12 bg-yellow-200 mx-3"></div>
                    <div className="text-center flex-1">
                      <p className="text-xs font-medium text-yellow-700 uppercase tracking-wide mb-1">Precio por Kg</p>
                      <p className="text-2xl font-bold text-yellow-800">{formatPrice(product.pricePerKg)}</p>
                    </div>
                  </div>
                </div>

                
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-yellow-300/50 transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
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
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        )}

      </main>

      {/* WhatsApp FAB */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse opacity-50 scale-110"></div>
          <button
            onClick={() => setShowContactMenu(!showContactMenu)}
            className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 
                       transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out
                       p-4 rounded-full shadow-2xl text-white flex items-center justify-center
                       border-4 border-white/20 backdrop-blur-sm animate-bounce-gentle"
            aria-label="Contactar por WhatsApp"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 animate-spin-slow"></div>
            <MessageCircle className={`h-7 w-7 relative z-10 transition-transform duration-300 ${showContactMenu ? 'rotate-12 scale-110' : ''}`} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
          </button>
        </div>

        {showContactMenu && (
          <div className="mt-4 relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>
            <div className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden w-56 transform animate-in slide-in-from-bottom-5 duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 opacity-20 animate-pulse"></div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 text-center">
                <h3 className="text-white font-bold text-sm flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4 animate-pulse" />
                  ¡Contáctanos Ahora!
                </h3>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleWhatsAppContact('minorista')}
                  className="group relative w-full py-3 px-4 rounded-xl overflow-hidden
                             bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100
                             border border-green-200/50 hover:border-green-300
                             transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                             text-green-800 font-semibold"
                >
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <span>🏢 Contacto Mayorista</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  </div>
                </button>
              </div>
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