'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Importar todos los componentes
import EpicChickLoading from '../app/components/EpicChickLoading'
import Header from '../app/components/Header'
import SearchAndFilters from '../app/components/SearchAndFilters'
import ProductCounter from '../app/components/ProductCounter'
import ProductCard from '../app/components/ProductCard'
import EmptyState from '../app/components/EmptyState'
import WhatsAppFAB from '../app/components/WhatsAppFAB'

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSaleType, setSelectedSaleType] = useState('menor') // Por defecto "Por Menor"
  const [loading, setLoading] = useState(true)
  const [showContactMenu, setShowContactMenu] = useState(false)

  // Categorías permitidas para venta por mayor
  const mayorCategoryNames = ['Rebozados', 'Cajones', 'Pescados', 'Ofertas']

  const formatPrice = (price) => {
    if (!price) return '-'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const filterProducts = () => {
    let filtered = products

    // 1. Filtrar por tipo de venta (mayor/menor)
    filtered = filtered.filter(product => {
      if (selectedSaleType === 'mayor') {
        // Para venta por mayor: debe tener precio unitario Y estar en categorías permitidas
        return product.price && mayorCategoryNames.includes(product.category)
      } else {
        // Para venta por menor: debe tener precio por kg
        return product.pricePerKg
      }
    })

    // 2. Filtrar por categoría seleccionada
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.categoryId.toString() === selectedCategory
      )
    }

    // 3. Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
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

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedSaleType('menor') // Reset también el tipo de venta
  }

  useEffect(() => {
    const fetchData = async () => {
      // Simulación de carga con delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

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
  }, [searchTerm, selectedCategory, selectedSaleType, products])

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
          setSelectedCategory={setSelectedCategory}
          selectedSaleType={selectedSaleType}
          setSelectedSaleType={setSelectedSaleType}
          categories={categories}
        />

        <ProductCounter count={filteredProducts.length} />

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
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