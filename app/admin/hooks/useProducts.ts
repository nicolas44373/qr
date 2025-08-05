// hooks/useProducts.ts
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export type ProductPayload = {
  name: string
  price: string
  unit?: string
  category_id: string
  marca?: string | null
}

export type Product = {
  id: number
  name: string
  price: string | null
  unit: string | null
  category_id: number
  marca: string | null
  category_name: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadAll = async () => {
    try {
      setLoading(true)
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase
          .from('products')
          .select('id, name, price, unit, category_id, marca, categories(name)')
          .order('name'),
        supabase.from('categories').select('id, name').order('name')
      ])

      if (productsData) {
        setProducts(
          productsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            unit: p.unit,
            category_id: p.category_id,
            marca: p.marca,
            category_name: p.categories?.name || ''
          }))
        )
      }
      if (categoriesData) setCategories(categoriesData)
    } catch (e) {
      console.error('Error cargando productos/categorías', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const addProduct = async (payload: ProductPayload) => {
    try {
      setSubmitting(true)
      const { error } = await supabase.from('products').insert([
        {
          name: payload.name,
          price: payload.price !== '' ? payload.price : null,
          unit: payload.unit || null,
          category_id: Number(payload.category_id),
          marca: payload.marca || null
        }
      ])
      if (error) throw error
      await loadAll()
      return { success: true }
    } catch (error: any) {
      console.error(error)
      return { success: false, error: error.message || 'Error' }
    } finally {
      setSubmitting(false)
    }
  }

  const updateProduct = async (id: number | string, payload: ProductPayload) => {
    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('products')
        .update({
          name: payload.name,
          price: payload.price !== '' ? payload.price : null,
          unit: payload.unit || null,
          category_id: Number(payload.category_id),
          marca: payload.marca || null
        })
        .eq('id', id)
      if (error) throw error
      await loadAll()
      return { success: true }
    } catch (error: any) {
      console.error(error)
      return { success: false, error: error.message || 'Error' }
    } finally {
      setSubmitting(false)
    }
  }

  const deleteProduct = async (id: number | string) => {
    try {
      setSubmitting(true)
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      await loadAll()
      return { success: true }
    } catch (error: any) {
      console.error(error)
      return { success: false, error: error.message || 'Error' }
    } finally {
      setSubmitting(false)
    }
  }

  return {
    products,
    categories,
    loading,
    submitting,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
