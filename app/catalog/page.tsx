'use client'

import React, { useEffect, useState } from 'react'
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

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get('category')
  const [products, setProducts] = useState<ProductRow[]>([])
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Componente para renderizar un producto individual
  const ProductCard = ({ product }: { product: ProductRow }) => (
    <div className="border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition bg-white">
      <div className="mb-2">
        <h3 className="font-semibold text-lg line-clamp-2 text-black">{product.name}</h3>
        {product.marca && categoryName !== 'Rebozados' && (
          <p className="text-xs uppercase tracking-wide text-gray-700 mt-1">
            Marca: {product.marca}
          </p>
        )}
      </div>

      <div className="mt-2">
        <div className="flex flex-wrap gap-4">
          {product.price && (
            <div>
              <div className="text-xs text-black">Precio unidad</div>
              <div className="font-bold text-green-600">{formatMoney(product.price)}</div>
            </div>
          )}
          {product.price_per_kg && (
            <div>
              <div className="text-xs text-black">
                Precio por kilo ({product.unit || 'kg'})
              </div>
              <div className="font-bold text-green-600">{formatMoney(product.price_per_kg)}</div>
            </div>
          )}
          {!product.price && !product.price_per_kg && (
            <div className="text-sm text-black">
              Sin precio disponible
            </div>
          )}
        </div>
      </div>

      {product.unit && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="text-sm text-black">Unidad: {product.unit}</div>
        </div>
      )}
    </div>
  )

  if (loading) {
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

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 font-semibold mb-4 text-lg">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Volver
        </button>
      </div>
    )
  }

  const isRebozados = categoryName === 'Rebozados'
  const groupedProducts = isRebozados ? groupProductsByBrand(products) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black">
            {categoryName ? categoryName : 'Catálogo'}
          </h1>
          {categoryName && (
            <p className="text-lg text-black mt-2">
              Productos por mayor en la categoría <strong>{categoryName}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-black text-xl mb-2">
            No hay productos con precio en esta categoría.
          </p>
          <p className="text-black">
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
                <div key={brand} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-orange-500 w-1 h-8 rounded-full mr-4"></div>
                    <div>
                      <h2 className="text-2xl font-bold text-black">{brand}</h2>
                      <p className="text-black">{brandProducts.length} producto{brandProducts.length !== 1 ? 's' : ''}</p>
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
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              ¿Necesitás más información?
            </h3>
            <p className="text-orange-700">
              Contactanos por WhatsApp para consultar disponibilidad, cantidades mínimas y condiciones especiales.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}