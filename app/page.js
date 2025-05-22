'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Filter, Phone, Mail, ShoppingBag, MessageCircle, Users, Store } from 'lucide-react'
import Image from 'next/image'

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showContactMenu, setShowContactMenu] = useState(false)

  // ✅ Función para formatear el precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.categories?.id.toString() === selectedCategory
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchTerm])

  const fetchData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('is_available', true)
        .order('name')

      if (productsError) throw productsError

      setCategories(categoriesData || [])
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppContact = (type) => {
    const phoneMinorista = 3816516018
    const phoneMayorista = 3812224766
    
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-3 rounded-xl shadow-md">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Alenort
                </h1>
                <p className="text-sm text-gray-600 font-medium">Catálogo de Productos</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
                className="flex items-center space-x-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-full transition-all duration-200 font-medium"
              >
                <Phone className="h-5 w-5" />
                <span className="hidden sm:inline">Llamar</span>
              </a>
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                className="flex items-center space-x-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-full transition-all duration-200 font-medium"
              >
                <Mail className="h-5 w-5" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Barra de búsqueda y filtros */}
        <div className="mb-12 space-y-6">
          {/* Búsqueda */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar productos en nuestro catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 transition-all duration-200 text-lg shadow-lg"
            />
          </div>

          {/* Filtros de categoría */}
          <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-2">
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-200">
              <Filter className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <span className="text-yellow-700 font-medium text-sm">Filtrar:</span>
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg scale-105'
                  : 'bg-white/80 text-gray-700 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300'
              }`}
            >
              Todos los productos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md ${
                  selectedCategory === category.id.toString()
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg scale-105'
                    : 'bg-white/80 text-gray-700 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border-2 border-yellow-200">
              <ShoppingBag className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <div className="text-gray-600 text-xl font-medium">No se encontraron productos</div>
              <p className="text-gray-500 mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-yellow-100">
                {/* Imagen del producto */}
                <div className="relative h-56 bg-gradient-to-br from-yellow-100 to-amber-100 overflow-hidden">
                  {product.image_url && !product.image_url.includes('via.placeholder.com') ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <ShoppingBag className="h-20 w-20 text-yellow-300" />
                    </div>
                  )}
                  {/* Overlay con precio */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-yellow-700 transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  
                  {product.categories && (
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">
                      {product.categories.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Botón flotante de contacto */}
      <div className="fixed bottom-8 right-8 z-30">
        {showContactMenu && (
          <div className="mb-4 space-y-3">
            <button
              onClick={() => handleWhatsAppContact('minorista')}
              className="flex items-center space-x-3 bg-white shadow-2xl rounded-2xl px-6 py-4 hover:bg-yellow-50 transition-all duration-200 border-2 border-yellow-200 w-full"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Sector Minorista</div>
                <div className="text-sm text-gray-600">Ventas al por menor</div>
              </div>
            </button>
            <button
              onClick={() => handleWhatsAppContact('mayorista')}
              className="flex items-center space-x-3 bg-white shadow-2xl rounded-2xl px-6 py-4 hover:bg-yellow-50 transition-all duration-200 border-2 border-yellow-200 w-full"
            >
              <div className="bg-purple-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Sector Mayorista</div>
                <div className="text-sm text-gray-600">Ventas al por mayor</div>
              </div>
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowContactMenu(!showContactMenu)}
          className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 border-4 border-white ${
            showContactMenu ? 'rotate-45' : 'hover:scale-110'
          }`}
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      </div>

      {/* Overlay para cerrar menú */}
      {showContactMenu && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowContactMenu(false)}
        ></div>
      )}

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t-2 border-yellow-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                Alenort
              </h3>
            </div>
            <p className="text-gray-600 font-medium mb-2">
              &copy; 2024 Alenort. Todos los derechos reservados.
            </p>
            <p className="text-sm text-gray-500 bg-yellow-50 px-4 py-2 rounded-full inline-block border border-yellow-200">
              Escanea el código QR para ver nuestro catálogo completo
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}