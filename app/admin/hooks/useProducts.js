'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert('Error al cargar las categorías')
    }
  }

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          price_per_kg,
          unit,
          marca,
          category_id,
          categories (
            id,
            name
          )
        `)
        .order('name')

      if (error) throw error
      
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        pricePerKg: product.price_per_kg,
        unit: product.unit,
        marca: product.marca || '',
        categoryId: product.category_id,
        category: product.categories?.name || 'Sin categoría'
      })) || []

      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Error al cargar los productos')
    }
  }

  const addProduct = async (productData) => {
    setSubmitting(true)
    try {
      const { data, error } = await supabase.from('products').insert([{
        name: productData.name.toUpperCase().trim(),
        price: productData.price ? parseFloat(productData.price) : null,
        price_per_kg: productData.price_per_kg ? parseFloat(productData.price_per_kg) : null,
        unit: productData.unit || 'kg',
        marca: productData.marca ? productData.marca.toUpperCase().trim() : '',
        category_id: parseInt(productData.category_id),
      }])

      if (error) throw error
      await fetchProducts()
      return { success: true }
    } catch (error) {
      console.error('Error adding product:', error)
      return { success: false, error: error.message }
    } finally {
      setSubmitting(false)
    }
  }

  const updateProduct = async (productId, productData) => {
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name.toUpperCase(),
          price: productData.price ? parseFloat(productData.price) : null,
          price_per_kg: productData.price_per_kg ? parseFloat(productData.price_per_kg) : null,
          unit: productData.unit || 'kg',
          marca: productData.marca ? productData.marca.toUpperCase().trim() : '',
          category_id: parseInt(productData.category_id)
        })
        .eq('id', productId)

      if (error) throw error
      await fetchProducts()
      return { success: true }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, error: error.message }
    } finally {
      setSubmitting(false)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      await fetchProducts()
      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchProducts()])
      setLoading(false)
    }
    loadData()
  }, [])

  return {
    products,
    categories,
    loading,
    submitting,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: () => Promise.all([fetchCategories(), fetchProducts()])
  }
}