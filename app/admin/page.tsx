'use client'

import { useState, useEffect } from 'react'
import { useProducts } from './hooks/useProducts'
import { useProductFilters } from './hooks/useProductFilters'
import AdminHeader from './components/AdminHeader'
import AdminStats from './components/AdminStats'
import ProductFilters from './components/ProductFilters'
import ProductForm from './components/ProductForm'
import ProductsTable from './components/ProductsTable'
import LoadingScreen from './components/LoadingScreen'
import PriceListModal from './components/PriceListModal'

type Toast = { message: string; type: 'success' | 'error' } | null
type ConfirmDel = { id: number | string; name: string } | null

const emptyForm = { name: '', price: '', unit: '', category_id: '', marca: '' }

export default function AdminPage() {
  const [showAddForm, setShowAddForm]     = useState(false)
  const [editingProduct, setEditingProduct] = useState<number | string | null>(null)
  const [editFormData, setEditFormData]   = useState<any>({ ...emptyForm })
  const [toast, setToast]                 = useState<Toast>(null)
  const [confirmDel, setConfirmDel]       = useState<ConfirmDel>(null)
  const [showPriceList, setShowPriceList] = useState(false)

  const { products, categories, loading, submitting, addProduct, updateProduct, deleteProduct } = useProducts()
  const { selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, filteredProducts } = useProductFilters(products)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const notify = (message: string, type: 'success' | 'error') => setToast({ message, type })

  const handleShowAdd = () => {
    setShowAddForm(true)
    setEditingProduct(null)
    setEditFormData({ ...emptyForm })
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product.id)
    setEditFormData({
      name: product.name || '',
      price: product.price ?? '',
      unit: product.unit || '',
      category_id: product.category_id ? String(product.category_id) : '',
      marca: product.marca || '',
    })
    setShowAddForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (formData: any) => {
    if (editingProduct) {
      const r = await updateProduct(editingProduct, formData)
      if (r.success) { notify('Producto actualizado correctamente', 'success'); handleCancel() }
      else notify(`Error: ${r.error}`, 'error')
      return r
    } else {
      const r = await addProduct(formData)
      if (r.success) { notify('Producto agregado correctamente', 'success'); handleCancel() }
      else notify(`Error: ${r.error}`, 'error')
      return r
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingProduct(null)
    setEditFormData({ ...emptyForm })
  }

  const handleDeleteRequest = (product: any) => setConfirmDel({ id: product.id, name: product.name })

  const handleDeleteConfirm = async () => {
    if (!confirmDel) return
    const r = await deleteProduct(confirmDel.id)
    setConfirmDel(null)
    if (r.success) notify('Producto eliminado', 'success')
    else notify('Error al eliminar el producto', 'error')
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Toast ── */}
      <div className={`fixed top-5 right-5 z-50 transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold min-w-[240px] ${
          toast?.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          <span className="text-base">{toast?.type === 'success' ? '✓' : '✕'}</span>
          {toast?.message}
        </div>
      </div>

      {/* ── Modal confirmar eliminación ── */}
      {confirmDel && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
            <div className="text-4xl mb-4 text-center">🗑️</div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2 text-center">¿Eliminar producto?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Vas a eliminar <strong className="text-gray-800">"{confirmDel.name}"</strong>.<br />Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        <AdminStats
          products={products}
          categories={categories}
          filteredProducts={filteredProducts}
        />

        {/* Formulario */}
        <ProductForm
          isVisible={showAddForm || !!editingProduct}
          isEditing={!!editingProduct}
          categories={categories}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editFormData}
        />

        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          </div>
          <button
            onClick={() => setShowPriceList(true)}
            className="shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Lista de Precios
          </button>
          <button
            onClick={handleShowAdd}
            disabled={submitting}
            className="shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        <ProductsTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          submitting={submitting}
          editingId={editingProduct}
        />
      </main>

      {showPriceList && (
        <PriceListModal
          products={products}
          onClose={() => setShowPriceList(false)}
        />
      )}
    </div>
  )
}
