'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, Package, Filter, Search, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Formulario para productos
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    price_per_kg: '',
    unit: '',
    category_id: ''
  })

  // Cargar categorías desde Supabase
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

  // Cargar productos desde Supabase
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
          category_id,
          categories (
            id,
            name
          )
        `)
        .order('name')

      if (error) throw error
      
      // Transformar datos para compatibilidad con el componente
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        pricePerKg: product.price_per_kg,
        unit: product.unit,
        categoryId: product.category_id,
        category: product.categories?.name || 'Sin categoría'
      })) || []

      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Error al cargar los productos')
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchProducts()])
      setLoading(false)
    }
    loadData()
  }, [])

  // Filtrar productos
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

  const formatPrice = (price) => {
    if (!price) return '-'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      price_per_kg: '',
      unit: '',
      category_id: ''
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  // Función mejorada para mostrar el formulario de agregar
  const handleShowAddForm = () => {
    console.log('Mostrando formulario de agregar producto')
    setShowAddForm(true)
    setEditingProduct(null)
    setProductForm({
      name: '',
      price: '',
      price_per_kg: '',
      unit: 'kg', // valor por defecto
      category_id: ''
    })
  }

  const handleAddProduct = async () => {
    console.log('Intentando agregar producto:', productForm)
    
    if (!productForm.name.trim()) {
      alert('Por favor ingresa el nombre del producto')
      return
    }

    if (!productForm.category_id) {
      alert('Por favor selecciona una categoría')
      return
    }

    setSubmitting(true)

    try {
      const productData = {
        name: productForm.name.toUpperCase().trim(),
        price: productForm.price ? parseFloat(productForm.price) : null,
        price_per_kg: productForm.price_per_kg ? parseFloat(productForm.price_per_kg) : null,
        unit: productForm.unit || 'kg',
        category_id: parseInt(productForm.category_id),
      }

      console.log('Datos a insertar:', productData)

      const { data, error } = await supabase.from('products').insert([productData])

      if (error) {
        console.error('Error de Supabase:', error)
        throw error
      }

      console.log('Producto insertado exitosamente:', data)

      await fetchProducts() // Recargar productos desde Supabase
      resetForm()
      alert('Producto agregado exitosamente!')
    } catch (error) {
      console.error('Error al agregar producto:', error)
      alert(`Error al agregar el producto: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProduct = (product) => {
    console.log('Editando producto:', product)
    setEditingProduct(product.id)
    setProductForm({
      name: product.name,
      price: product.price || '',
      price_per_kg: product.pricePerKg || '',
      unit: product.unit || '',
      category_id: product.categoryId.toString()
    })
    setShowAddForm(false)
  }

  const handleUpdateProduct = async () => {
    if (!productForm.name || !productForm.category_id) {
      alert('Por favor completa al menos el nombre y la categoría')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: productForm.name.toUpperCase(),
          price: productForm.price ? parseFloat(productForm.price) : null,
          price_per_kg: productForm.price_per_kg ? parseFloat(productForm.price_per_kg) : null,
          unit: productForm.unit || 'kg',
          category_id: parseInt(productForm.category_id)
        })
        .eq('id', editingProduct)

      if (error) throw error

      // Recargar productos
      await fetchProducts()
      resetForm()
      alert('Producto actualizado exitosamente')

    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error al actualizar el producto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      // Recargar productos
      await fetchProducts()
      alert('Producto eliminado exitosamente')

    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-yellow-200">
          <div className="text-center">
            <Loader className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Cargando datos...</h2>
            <p className="text-gray-500">Conectando con la base de datos</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-yellow-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-4 rounded-xl shadow-md">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600 font-medium">Gestión de Productos - Alenort</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-semibold">Total Productos</p>
                <p className="text-3xl font-bold text-gray-800">{products.length}</p>
              </div>
              <Package className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-semibold">Categorías</p>
                <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <Filter className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-semibold">Productos Filtrados</p>
                <p className="text-3xl font-bold text-gray-800">{filteredProducts.length}</p>
              </div>
              <Search className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="mb-8 space-y-6">
          {/* Botón agregar */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleShowAddForm}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Producto</span>
            </button>
            {/* Debug info */}
            <div className="text-sm text-gray-500">
              Estado: {showAddForm ? 'Formulario visible' : 'Formulario oculto'} | 
              Editando: {editingProduct ? 'Sí' : 'No'}
            </div>
          </div>

          {/* Búsqueda y filtros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formulario de producto */}
        {(showAddForm || editingProduct) && (
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button
                onClick={resetForm}
                disabled={submitting}
                className="text-black hover:text-gray-700 p-2 disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-gray placeholder-gray"
                  placeholder="Ej: FILET DE MERLUZA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Precio por Caja/Unidad
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-gray placeholder-gray"
                  placeholder="Ej: 6999"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Precio por Kilogramo
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price_per_kg}
                  onChange={(e) => setProductForm({ ...productForm, price_per_kg: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-gray placeholder-gray"
                  placeholder="Ej: 6999"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Unidad
                </label>
                <input
                  type="text"
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-gray placeholder-gray"
                  placeholder="Ej: kg, caja, paquete"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Categoría *
                </label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-gray"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                disabled={submitting}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200"
              >
                {submitting ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>{submitting ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Guardar')}</span>
              </button>
              <button
                onClick={resetForm}
                disabled={submitting}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-yellow-200">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-4">
            <h3 className="text-xl font-bold text-white">
              Productos ({filteredProducts.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Producto</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">Categoría</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">Precio Unidad</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">Precio/Kg</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className={`border-b border-yellow-100 ${index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">
                      {formatPrice(product.pricePerKg)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          disabled={submitting}
                          className="bg-blue-100 hover:bg-blue-200 disabled:opacity-50 text-blue-600 p-2 rounded-lg transition-colors"
                          title="Editar producto"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={submitting}
                          className="bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-600 p-2 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No se encontraron productos</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}