'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' // ajustá si el path es distinto

// Tipos según tu esquema
type ProductRow = {
  id: number | string
  name: string
  price: string | null
  price_per_kg: string | null
  unit: string | null
  category_id: number | string
  marca: string | null
  created_at: string
  updated_at: string
}

type CategoryRow = {
  id: number | string
  name: string
}

const formatMoney = (value: string | null) => {
  if (!value) return '—'
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  return `$ ${num.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get('category')
  const [products, setProducts] = useState<ProductRow[]>([])
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  // Inicializar el modo oscuro desde localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode))
    }
  }, [])

  // Guardar el modo oscuro en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    const load = async () => {
      if (!categoryId) {
        setError('No se seleccionó ninguna categoría.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Obtener nombre de la categoría
        const { data: categoryData, error: catErr } = await supabase
          .from('categories')
          .select('name')
          .eq('id', categoryId)
          .maybeSingle()

        if (catErr) throw catErr
        if (!categoryData) {
          setError('La categoría no existe.')
          return
        }
        setCategoryName((categoryData as { name: string }).name)

        // Cargar productos que tengan price o price_per_kg
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, price_per_kg, unit, marca, category_id')
          .eq('category_id', categoryId)
          .or('price.not.is.null,price_per_kg.not.is.null')
          .order('name')

        if (productsError) throw productsError

        setProducts((productsData as ProductRow[]) || [])
      } catch (e: any) {
        console.error('Error cargando catálogo:', e)
        setError('Ocurrió un error al cargar los productos. Volvé a intentarlo.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [categoryId])

  // Función para agrupar productos por marca
  const groupProductsByBrand = (products: ProductRow[]) => {
    const grouped: { [key: string]: ProductRow[] } = {}
    
    products.forEach(product => {
      const brand = product.marca || 'Sin marca'
      if (!grouped[brand]) {
        grouped[brand] = []
      }
      grouped[brand].push(product)
    })
    
    return grouped
  }

  // Componente para el botón de modo oscuro
  const ThemeToggle = () => (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`p-2 rounded-lg transition-colors ${
        darkMode 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {darkMode ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )

  // Componente para renderizar un producto individual
  const ProductCard = ({ product }: { product: ProductRow }) => (
    <div className={`border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-2">
        <h3 className={`font-semibold text-lg line-clamp-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {product.name}
        </h3>
        {product.marca && categoryName !== 'Rebozados' && (
          <p className={`text-xs uppercase tracking-wide mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Marca: {product.marca}
          </p>
        )}
      </div>

      <div className="mt-2">
        <div className="flex flex-wrap gap-4">
          {product.price && (
            <div>
              <div className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Precio unidad
              </div>
              <div className="font-bold text-green-600">{formatMoney(product.price)}</div>
            </div>
          )}
          
          {!product.price && !product.price_per_kg && (
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Sin precio disponible
            </div>
          )}
        </div>
      </div>

      {product.unit && (
        <div className={`mt-3 pt-2 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Unidad: {product.unit}
          </div>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className={`animate-pulse mb-2 h-6 w-48 rounded mx-auto ${
              darkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div className={`animate-pulse h-4 w-32 rounded mx-auto ${
              darkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-lg mx-auto p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold mb-4 text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className={`px-6 py-3 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  const isRebozados = categoryName === 'Rebozados'
  const groupedProducts = isRebozados ? groupProductsByBrand(products) : null

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {categoryName ? categoryName : 'Catálogo'}
            </h1>
            {categoryName && (
              <p className={`text-lg mt-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Productos por mayor en la categoría <strong>{categoryName}</strong>
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => router.back()}
              className={`text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className={`text-xl mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              No hay productos con precio en esta categoría.
            </p>
            <p className={`${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Los productos se mostrarán aquí una vez que tengan precios asignados.
            </p>
          </div>
        ) : (
          <>
            {isRebozados && groupedProducts ? (
              // Vista agrupada por marcas para Rebozados
              <div className="space-y-8">
                {Object.entries(groupedProducts)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([brand, brandProducts]) => (
                  <div key={brand} className={`rounded-2xl p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center mb-6">
                      <div className="bg-orange-500 w-1 h-8 rounded-full mr-4"></div>
                      <div>
                        <h2 className={`text-2xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {brand}
                        </h2>
                        <p className={`${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {brandProducts.length} producto{brandProducts.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {brandProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Vista normal para otras categorías
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {products.length > 0 && (
          <div className="mt-12 text-center">
            <div className={`border rounded-xl p-6 max-w-2xl mx-auto ${
              darkMode 
                ? 'bg-orange-900/20 border-orange-700 text-orange-200' 
                : 'bg-orange-50 border-orange-200 text-orange-700'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-orange-100' : 'text-orange-800'
              }`}>
                ¿Necesitás más información?
              </h3>
              <p>
                Contactanos por WhatsApp para consultar disponibilidad, cantidades mínimas y condiciones especiales.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading fallback component
function CatalogLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <div className="animate-pulse mb-2 h-6 w-48 bg-gray-300 rounded mx-auto"></div>
        <div className="animate-pulse h-4 w-32 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  )
}