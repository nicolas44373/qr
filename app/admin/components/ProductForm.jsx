import { useState, useEffect } from 'react'
import { Save, X, Loader } from 'lucide-react'

export default function ProductForm({ 
  isVisible, 
  isEditing, 
  categories, 
  submitting, 
  onSubmit, 
  onCancel,
  initialData = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    price_per_kg: '',
    unit: 'kg',
    category_id: '',
    marca: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      // Limpia los campos si no hay datos iniciales (cuando agregás uno nuevo)
      setFormData({
        name: '',
        price: '',
        price_per_kg: '',
        unit: 'kg',
        category_id: '',
        marca: ''
      })
    }
  }, [initialData])

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Por favor ingresa el nombre del producto')
      return
    }
    if (!formData.category_id) {
      alert('Por favor selecciona una categoría')
      return
    }

    const result = await onSubmit(formData)
    if (result.success && !isEditing) {
      setFormData({
        name: '',
        price: '',
        price_per_kg: '',
        unit: 'kg',
        category_id: '',
        marca: ''
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-black">
          {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h3>
        <button
          onClick={onCancel}
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={submitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-black placeholder-gray"
            placeholder="Ej: FILET DE MERLUZA"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Marca
          </label>
          <select
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
            disabled={submitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-black"
          >
            <option value="">Seleccionar marca</option>
            <option value="Grangys">Grangys</option>
            <option value="GTA">GTA</option>
            <option value="Vidal Food">Vidal Food</option>
            <option value="Shaddai">Shaddai</option>
            <option value="Solimeno">Solimeno</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Precio por Caja/Unidad
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            disabled={submitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-black placeholder-gray"
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
            value={formData.price_per_kg}
            onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
            disabled={submitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-black placeholder-gray"
            placeholder="Ej: 6999"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Unidad
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            disabled={submitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-black placeholder-gray"
            placeholder="Ej: kg, caja, paquete"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Categoría *
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            disabled={submitting}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 disabled:opacity-50 text-black"
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
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200"
        >
          {submitting ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}</span>
        </button>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
