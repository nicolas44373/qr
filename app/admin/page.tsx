'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useProducts } from './hooks/useProducts'
import { useProductFilters } from './hooks/useProductFilters'
import AdminHeader from './components/AdminHeader'
import AdminStats from './components/AdminStats'
import ProductFilters from './components/ProductFilters'
import ProductForm from './components/ProductForm'
import ProductsTable from './components/ProductsTable'
import LoadingScreen from './components/LoadingScreen'

export default function AdminPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<number | string | null>(null)
  const [editFormData, setEditFormData] = useState<any>({
    name: '',
    price: '',
    unit: '',
    category_id: '',
    marca: ''
  })

  const {
    products,
    categories,
    loading,
    submitting,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProducts()

  const {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    filteredProducts
  } = useProductFilters(products)

  const emptyForm = {
    name: '',
    price: '',
    unit: '',
    category_id: '',
    marca: ''
  }

  const handleShowAddForm = () => {
    setShowAddForm(true)
    setEditingProduct(null)
    setEditFormData({ ...emptyForm })
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product.id)
    setEditFormData({
      name: product.name || '',
      price: product.price ?? '',
      unit: product.unit || '',
      category_id: product.category_id ? String(product.category_id) : '',
      marca: product.marca || ''
    })
    setShowAddForm(false)
  }

  const handleFormSubmit = async (formData: any) => {
    if (editingProduct) {
      const result = await updateProduct(editingProduct, formData)
      if (result.success) {
        alert('Producto actualizado exitosamente')
        handleFormCancel()
      } else {
        alert(`Error al actualizar el producto: ${result.error}`)
      }
      return result
    } else {
      const result = await addProduct(formData)
      if (result.success) {
        alert('Producto agregado exitosamente!')
        handleFormCancel()
      } else {
        alert(`Error al agregar el producto: ${result.error}`)
      }
      return result
    }
  }

  const handleFormCancel = () => {
    setShowAddForm(false)
    setEditingProduct(null)
    setEditFormData({ ...emptyForm })
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <AdminStats 
          products={products}
          categories={categories}
          filteredProducts={filteredProducts}
        />

        <div className="mb-8 space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handleShowAddForm}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Producto</span>
            </button>
          </div>

          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        </div>

        <ProductForm
          isVisible={showAddForm || !!editingProduct}
          isEditing={!!editingProduct}
          categories={categories}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editFormData}
        />

        <ProductsTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
          submitting={submitting}
        />
      </main>
    </div>
  )
}
