'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Phone, Mail, ShoppingBag, MessageCircle, Users, Store, Package } from 'lucide-react'

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showContactMenu, setShowContactMenu] = useState(false)

  // Datos de ejemplo basados en tu lista
  const sampleProducts = [
    // Pollo
    { id: 1, name: 'PATA MUSLO X 3 KG', price: 6500, pricePerKg: 2400, unit: 'caja', category: 'Pollo', categoryId: 1 },
    { id: 2, name: 'FILET X 3KG', price: 23500, pricePerKg: 8500, unit: 'caja', category: 'Pollo', categoryId: 1 },
    { id: 3, name: 'REBOZADOS X3KG', price: 13999, pricePerKg: null, unit: 'caja', category: 'Pollo', categoryId: 1 },
    { id: 4, name: '2 POLLOS ENTEROS', price: 9999, pricePerKg: null, unit: 'pack', category: 'Pollo', categoryId: 1 },
    { id: 5, name: 'SUPREMA', price: null, pricePerKg: 8000, unit: 'kg', category: 'Pollo', categoryId: 1 },
    
    // Otros productos
    { id: 6, name: 'BANDEJA DE HUEVOS', price: 6900, pricePerKg: null, unit: 'bandeja', category: 'Otros', categoryId: 2 },
    { id: 7, name: 'PAN RALLADO X 400GR', price: 599, pricePerKg: null, unit: 'paquete', category: 'Otros', categoryId: 2 },
    
    // Pescados
    { id: 8, name: 'FILET DE MERLUZA', price: 6999, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 9, name: 'FILET DE ATUN', price: 9999, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 10, name: 'MILA DE MERLUZA TRADICIONAL', price: 8300, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 11, name: 'MILA DE MERLUZA FINAS HIERBAS', price: 8999, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 12, name: 'MILA DE MERLUZA A LA ROMANA', price: 8999, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 13, name: 'MEDALLON DE MERLUZA TRADICIONAL', price: 4500, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 14, name: 'MEDALLON DE MERLUZA EYQ', price: 5000, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 15, name: 'MEDALLON DE MERLUZA JYQ', price: 5000, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 16, name: 'MEDALLON DE MERLUZA ROQUEFORT', price: 6500, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 17, name: 'MEDALLON DE MERLUZA PRIMAVERA', price: 5000, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 18, name: 'MEDALLON DE MERLUZA CAPREZE', price: 5000, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 19, name: 'MEDALLON DE MERLUZA FINAS HIERBAS', price: 5000, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 20, name: 'FORMITAS DE MERLUZA', price: 4000, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 },
    { id: 21, name: 'BASTONES DE MERLUZA', price: 4500, pricePerKg: null, unit: 'kg', category: 'Pescados', categoryId: 3 }
  ]

  const sampleCategories = [
    { id: 1, name: 'Pollo' },
    { id: 2, name: 'Otros' },
    { id: 3, name: 'Pescados' }
  ]

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
    // Simular carga de datos
    setTimeout(() => {
      setProducts(sampleProducts)
      setCategories(sampleCategories)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchTerm])

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
                href="tel:+5493816516018"
                className="flex items-center space-x-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-full transition-all duration-200 font-medium"
              >
                <Phone className="h-5 w-5" />
                <span className="hidden sm:inline">Llamar</span>
              </a>
              <a 
                href="mailto:info@alenort.com"
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

        {/* Lista de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border-2 border-yellow-200">
              <ShoppingBag className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <div className="text-gray-600 text-xl font-medium">No se encontraron productos</div>
              <p className="text-gray-500 mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border-2 border-yellow-200">
            {/* Encabezado de la tabla */}
            <div className="bg-gradient-to-r from-yellow-400 to-amber-400 px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white font-bold text-lg">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>PRODUCTO</span>
                </div>
                <div className="text-center">CATEGORÍA</div>
                <div className="text-center">PRECIO POR CAJA/UNIDAD</div>
                <div className="text-center">PRECIO POR KG</div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="divide-y divide-yellow-100">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`px-8 py-6 hover:bg-yellow-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Nombre del producto */}
                    <div className="font-semibold text-gray-800 text-lg">
                      {product.name}
                    </div>
                    
                    {/* Categoría */}
                    <div className="text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full border border-yellow-200">
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Precio por caja/unidad */}
                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.unit && (
                        <div className="text-sm text-gray-500 mt-1">por {product.unit}</div>
                      )}
                    </div>
                    
                    {/* Precio por kg */}
                    <div className="text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(product.pricePerKg)}
                      </span>
                      {product.pricePerKg && (
                        <div className="text-sm text-gray-500 mt-1">por kg</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-yellow-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Información de Precios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                <h4 className="font-bold text-green-700 mb-2 flex items-center">
                  <span className="bg-green-100 p-2 rounded-full mr-3">
                    <Package className="h-5 w-5 text-green-600" />
                  </span>
                  Precio por Caja/Unidad
                </h4>
                <p className="text-green-600">Ideal para compras al por mayor. Mejor precio por cantidad.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-full mr-3">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </span>
                  Precio por Kilogramo
                </h4>
                <p className="text-blue-600">Perfecto para compras menores y uso doméstico.</p>
              </div>
            </div>
          </div>
        </div>
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