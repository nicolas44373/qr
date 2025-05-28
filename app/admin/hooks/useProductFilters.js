'use client'

import { useState, useEffect } from 'react'

export const useProductFilters = (products) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
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
  }, [products, selectedCategory, searchTerm])

  return {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    filteredProducts
  }
}