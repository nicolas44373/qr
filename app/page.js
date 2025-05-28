'use client'

import React, { useState, useEffect } from 'react'

// Componentes
import EpicChickLoading from '../app/components/EpicChickLoading'
import Header from '../app/components/Header'
import SearchAndFilters from '../app/components/SearchAndFilters'
import ProductCounter from '../app/components/ProductCounter'
import ProductCard from '../app/components/ProductCard'
import EmptyState from '../app/components/EmptyState'
import WhatsAppFAB from '../app/components/WhatsAppFAB'

export default function CatalogPage() {
  const [products] = useState([])
  const [categories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSaleType, setSelectedSaleType] = useState('menor')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [loading] = useState(true)
  const [showContactMenu, setShowContactMenu] = useState(false)

  const mayorCategoryNames = ['Rebozados', 'Cajones', 'Pescados', 'Ofertas']
  const rebozadosBrands = ['GRANGYS', 'GTA', 'SHADDAI', 'VIDAL FOOD', 'SOLIMENO']

  const formatPrice = (price) => {
    if (!price) return '-'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedSaleType('menor')
    setSelectedBrand('all')
  }

  const handleWhatsAppContact = (type) => {
    const phoneMinorista = '+5493816516018'
    const phoneMayorista = '+5493812224766'
    const phone = type === 'minorista' ? phoneMinorista : phoneMayorista
    const message = `Hola! Me interesa obtener información sobre sus productos para ${type}.`
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowContactMenu(false)
  }

  useEffect(() => {
    const filterProducts = () => {
      let filtered = products

      // 1. Filtrar por tipo de venta
      filtered = filtered.filter(product => {
        if (selectedSaleType === 'mayor') {
          return product.price && mayorCategoryNames.includes(product.category)
        } else {
          return product.pricePerKg
        }
      })

      // 2. Filtrar por categoría
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product =>
          product.categoryId.toString() === selectedCategory
        )
      }

      // 3. Filtrar por subcategoría (marca) si es Rebozados y por mayor
      if (
        selectedSaleType === 'mayor' &&
        categories.find(cat => cat.id.toString() === selectedCategory)?.name === 'Rebozados'
      ) {
        // Siempre mostrar productos de marcas reconocidas, independientemente de selectedBrand
        filtered = filtered.filter(product =>
          rebozadosBrands.some(brand => 
            product.brand?.toUpperCase() === brand.toUpperCase()
          )
        )
        
        // Solo filtrar por marca específica si no es 'all'
        if (selectedBrand !== 'all') {
          filtered = filtered.filter(product =>
            product.brand?.toUpperCase() === selectedBrand.toUpperCase()
          )
        }
      }

      // 4. Filtrar por búsqueda
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }

      setFilteredProducts(filtered)
    }

    filterProducts()
  }, [searchTerm, selectedCategory, selectedSaleType, selectedBrand, products, categories, mayorCategoryNames, rebozadosBrands])

  const currentCategoryName = categories.find(cat => cat.id.toString() === selectedCategory)?.name

  if (loading) {
    return <EpicChickLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 py-8 sm:py-10">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat)
            setSelectedBrand('all') // Reinicia subcategoría al cambiar de categoría
          }}
          selectedSaleType={selectedSaleType}
          setSelectedSaleType={(type) => {
            setSelectedSaleType(type)
            setSelectedBrand('all') // Reinicia subcategoría al cambiar tipo de venta
          }}
          selectedSubCategory={selectedBrand}
          setSelectedSubCategory={setSelectedBrand} 
          categories={categories}
        />

        {/* Subcategorías (marcas) para Rebozados por Mayor */}
        {selectedSaleType === 'mayor' && currentCategoryName === 'Rebozados' && (
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['all', ...rebozadosBrands].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md ${
                  selectedBrand === brand
                    ? 'bg-yellow-400 text-white scale-105'
                    : 'bg-white border border-yellow-200 text-gray-700 hover:bg-yellow-100'
                }`}
              >
                {brand === 'all' ? 'Todas las marcas' : brand}
              </button>
            ))}
          </div>
        )}

        <ProductCounter count={filteredProducts.length} />

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                formatPrice={formatPrice}
                selectedSaleType={selectedSaleType}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={handleResetFilters} />
        )}
      </main>

      <WhatsAppFAB
        showMenu={showContactMenu}
        setShowMenu={setShowContactMenu}
        onContact={handleWhatsAppContact}
      />
    </div>
  )
}