// hooks/useProductFilters.ts
'use client'

import { useMemo, useState } from 'react'
import { Product } from './useProducts'

export function useProductFilters(products: Product[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        !selectedCategory || String(p.category_id) === String(selectedCategory)
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchTerm])

  return {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    filteredProducts
  }
}
