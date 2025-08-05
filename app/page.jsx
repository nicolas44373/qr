'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// Componentes
import EpicChickLoading from './components/EpicChickLoading'
import Header from './components/Header'
import WhatsAppFAB from './components/WhatsAppFAB'

export default function MainPage() {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showContactMenu, setShowContactMenu] = useState(false)
  const router = useRouter()

  // Configuración visual para cada categoría
  const categoryConfig = {
    'Pata Muslo': {
      imageSrc: '/pata.jpeg',
      bgColor: 'from-orange-400 to-orange-600',
      hoverColor: 'hover:from-orange-500 hover:to-orange-700',
      description: 'Cortes frescos de pata y muslo'
    },
    Filet: {
      imageSrc: '/filet.JPG',
      bgColor: 'from-red-400 to-red-600',
      hoverColor: 'hover:from-red-500 hover:to-red-700',
      description: 'Pechugas y cortes premium'
    },
    Cajones: {
      imageSrc: '/cajon.jpeg',
      bgColor: 'from-amber-400 to-amber-600',
      hoverColor: 'hover:from-amber-500 hover:to-amber-700',
      description: 'Pollo entero por cajones'
    },
    Ofertas: {
      imageSrc: '/categories/ofertas.jpg',
      bgColor: 'from-green-400 to-green-600',
      hoverColor: 'hover:from-green-500 hover:to-green-700',
      description: 'Promociones especiales'
    },
    Pescados: {
      imageSrc: '/pescado.JPG',
      bgColor: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700',
      description: 'Productos del mar frescos'
    },
    Rebozados: {
      imageSrc: '/rebo.JPG',
      bgColor: 'from-purple-400 to-purple-600',
      hoverColor: 'hover:from-purple-500 hover:to-purple-700',
      description: 'Productos elaborados'
    }
  }

  // Cargar categorías y contar productos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Cargar categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name')
        
        if (categoriesError) throw categoriesError

        // Cargar productos para contar por categoría
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('category_id, price')
        
        if (productsError) throw productsError

        // Contar productos por categoría (solo los que tienen precio - productos por mayor)
        const counts = {}
        productsData?.forEach(product => {
          if (product.price) { // Solo contar productos con precio (por mayor)
            counts[product.category_id] = (counts[product.category_id] || 0) + 1
          }
        })

        // Filtrar solo las categorías que queremos mostrar y que tienen productos
        const targetCategories = ['Pata Muslo', 'Filet', 'Cajones', 'Ofertas', 'Pescados', 'Rebozados']
        const filteredCategories = categoriesData?.filter(category => 
          targetCategories.includes(category.name) && counts[category.id] > 0
        ) || []

        setCategories(filteredCategories)
        setProductCounts(counts)
        
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCategoryClick = (categoryId) => {
    // Navegar a la página de catálogo con la categoría seleccionada
    router.push(`/catalog?category=${categoryId}`)
  }

  const handleWhatsAppContact = (type) => {
    const phoneMayorista = '+5493812224766'
    const message = `Hola! Me interesa obtener información sobre sus productos por mayor.`
    const whatsappUrl = `https://wa.me/${phoneMayorista}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowContactMenu(false)
  }

  if (loading) {
    return <EpicChickLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Nuestros Productos
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Selecciona una categoría para ver nuestros productos por mayor
          </p>
        </div>

        {/* Grid de categorías */}
        {categories.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {categories.map((category) => {
              const config = categoryConfig[category.name] || {
                imageSrc: '/default-category.jpg',
                bgColor: 'from-gray-400 to-gray-600',
                hoverColor: 'hover:from-gray-500 hover:to-gray-700',
                description: 'Productos disponibles'
              }
              
              const productCount = productCounts[category.id] || 0

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    group relative overflow-hidden rounded-2xl
                    bg-gradient-to-br ${config.bgColor} ${config.hoverColor}
                    transform transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl
                    focus:outline-none focus:ring-4 focus:ring-yellow-300
                    active:scale-95
                    h-80 sm:h-96
                  `}
                >
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0">
                    <Image
                      src={config.imageSrc}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay oscuro para mejorar legibilidad del texto */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                  </div>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
                  
                  {/* Badge de cantidad de productos */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                    <span className="text-white text-sm font-semibold">
                      {productCount} productos
                    </span>
                  </div>
                  
                  {/* Contenido del botón */}
                  <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8">
                    {/* Nombre de la categoría */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300">
                      {category.name}
                    </h3>
                    
                    {/* Descripción */}
                    <p className="text-lg sm:text-xl text-white/90 group-hover:text-white transition-colors duration-300 mb-4">
                      {config.description}
                    </p>
                    
                    {/* Indicador de acción */}
                    <div className="inline-flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-medium">Ver productos</span>
                      <svg 
                        className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-600">
              Aún no se han cargado productos en las categorías principales.
            </p>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Venta por Mayor
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Ofrecemos los mejores precios en productos avícolas y del mar para tu negocio. 
              Calidad garantizada y entrega confiable.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Productos frescos
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Precios mayoristas
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Entrega rápida
              </span>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppFAB
        showMenu={showContactMenu}
        setShowMenu={setShowContactMenu}
        onContact={handleWhatsAppContact}
      />
    </div>
  )
}